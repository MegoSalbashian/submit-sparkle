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
      const isSuccess = record[`${type}_status`].toLowerCase() === 'approved';
      
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

      console.log('Fetched records:', records);

      // Calculate performance metrics
      const metrics: DashboardMetrics = {
        handover: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
        deposits: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
        invoices: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 }
      };

      const safeRecords = records || [];

      ['handover', 'deposits', 'invoices'].forEach(type => {
        const statusKey = `${type}_status`;
        
        metrics[type as keyof DashboardMetrics].total = safeRecords.length;
        metrics[type as keyof DashboardMetrics].approved = safeRecords.filter(r => r[statusKey]?.toLowerCase() === 'approved').length;
        metrics[type as keyof DashboardMetrics].rejected = safeRecords.filter(r => r[statusKey]?.toLowerCase() === 'rejected').length;
        
        const { currentStreak, longestStreak } = calculateStreak(safeRecords, type);
        metrics[type as keyof DashboardMetrics].streak = currentStreak;
        metrics[type as keyof DashboardMetrics].longestStreak = longestStreak;
      });

      setPerformanceMetrics(metrics);

      // Calculate success rates for chart
      const groupedRecords = safeRecords.reduce((acc: any, record: any) => {
        const date = record.date;
        if (!acc[date]) {
          acc[date] = {
            total: 0,
            successful: 0
          };
        }
        acc[date].total++;
        if (
          record.handover_status?.toLowerCase() === 'approved' &&
          record.deposit_status?.toLowerCase() === 'approved' &&
          record.invoice_status?.toLowerCase() === 'approved'
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
        const branchRecords = safeRecords.filter((r: any) => r.branch_id === branch.id) || [];
        const streaks = {
          handover: calculateStreak(branchRecords, 'handover').currentStreak,
          deposits: calculateStreak(branchRecords, 'deposits').currentStreak,
          invoices: calculateStreak(branchRecords, 'invoices').currentStreak
        };
        
        const successRate = branchRecords.length > 0
          ? (branchRecords.filter((r: any) => 
              r.handover_status?.toLowerCase() === 'approved' && 
              r.deposit_status?.toLowerCase() === 'approved' && 
              r.invoice_status?.toLowerCase() === 'approved'
            ).length / branchRecords.length) * 100
          : 0;

        return {
          id: branch.id,
          name: branch.name,
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