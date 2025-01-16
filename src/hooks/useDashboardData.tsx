import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Branch } from "@/services/branchService";

interface PerformanceMetrics {
  total: number;
  approved: number;
  rejected: number;
  streak: number;
  longestStreak: number;
}

interface DashboardMetrics {
  handover: PerformanceMetrics;
  deposits: PerformanceMetrics;
  invoices: PerformanceMetrics;
}

interface BranchStreak {
  id: string;
  name: string;
  streaks: {
    handover: number;
    deposits: number;
    invoices: number;
  };
  successRate: number;
}

export const useDashboardData = (
  selectedBranch: string,
  dateRange: string,
  branches: Branch[]
) => {
  const [submissionHistory, setSubmissionHistory] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<DashboardMetrics>({
    handover: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
    deposits: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
    invoices: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 }
  });
  const [branchStreaks, setBranchStreaks] = useState<BranchStreak[]>([]);

  const calculateStreak = (records: any[], type: string) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let lastSuccess = true;

    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    records.forEach((record) => {
      const isSuccess = record[`${type}_status`] === 'approved';
      
      if (isSuccess && lastSuccess) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (!isSuccess) {
        currentStreak = 0;
      }
      
      lastSuccess = isSuccess;
    });

    return { currentStreak, longestStreak };
  };

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase
        .from('records')
        .select('*, branches(name)');

      if (selectedBranch !== 'all') {
        query = query.eq('branch_id', selectedBranch);
      }

      const daysToSubtract = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        'all': 365
      }[dateRange];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToSubtract);

      query = query.gte('date', startDate.toISOString().split('T')[0]);

      const { data: records, error } = await query;

      if (error) {
        console.error('Error fetching records:', error);
        return;
      }

      // Calculate performance metrics
      const metrics: DashboardMetrics = {
        handover: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
        deposits: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
        invoices: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 }
      };

      ['handover', 'deposits', 'invoices'].forEach(type => {
        const statusKey = `${type}_status`;
        metrics[type as keyof DashboardMetrics].total = records?.length || 0;
        metrics[type as keyof DashboardMetrics].approved = records?.filter(r => r[statusKey] === 'approved').length || 0;
        metrics[type as keyof DashboardMetrics].rejected = records?.filter(r => r[statusKey] === 'rejected').length || 0;
        const { currentStreak, longestStreak } = calculateStreak(records || [], type);
        metrics[type as keyof DashboardMetrics].streak = currentStreak;
        metrics[type as keyof DashboardMetrics].longestStreak = longestStreak;
      });

      setPerformanceMetrics(metrics);

      // Calculate success rates for chart
      const groupedRecords = (records || []).reduce((acc: any, record: any) => {
        const date = record.date;
        if (!acc[date]) {
          acc[date] = {
            total: 0,
            successful: 0
          };
        }
        acc[date].total++;
        if (
          record.handover_status === 'approved' &&
          record.deposit_status === 'approved' &&
          record.invoice_status === 'approved'
        ) {
          acc[date].successful++;
        }
        return acc;
      }, {});

      const historyData = Object.entries(groupedRecords).map(([date, stats]: [string, any]) => ({
        date,
        successRate: (stats.successful / stats.total) * 100
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setSubmissionHistory(historyData);

      // Calculate branch streaks
      const branchMetrics = branches.map(branch => {
        const branchRecords = records?.filter((r: any) => r.branch_id === branch.id) || [];
        const streaks = {
          handover: calculateStreak(branchRecords, 'handover').currentStreak,
          deposits: calculateStreak(branchRecords, 'deposits').currentStreak,
          invoices: calculateStreak(branchRecords, 'invoice').currentStreak
        };
        
        const successRate = branchRecords.length > 0
          ? (branchRecords.filter((r: any) => 
              r.handover_status === 'approved' && 
              r.deposit_status === 'approved' && 
              r.invoice_status === 'approved'
            ).length / branchRecords.length) * 100
          : 0;

        return {
          ...branch,
          streaks,
          successRate
        };
      });

      setBranchStreaks(branchMetrics);
    };

    fetchData();
  }, [selectedBranch, dateRange, branches]);

  return {
    submissionHistory,
    performanceMetrics,
    branchStreaks
  };
};