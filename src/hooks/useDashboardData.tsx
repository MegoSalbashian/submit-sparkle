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
    if (!records || records.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let lastSuccess = true;

    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const record of sortedRecords) {
      const statusKey = `${type}_status`;
      if (!record[statusKey]) continue;
      
      const status = record[statusKey].toLowerCase();
      const isSuccess = status === 'approved';
      
      if (isSuccess && (currentStreak === 0 || lastSuccess)) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (!isSuccess) {
        currentStreak = 0;
      }
      
      lastSuccess = isSuccess;
    }

    return { currentStreak, longestStreak };
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data with params:', { selectedBranch, dateRange });
      
      let query = supabase
        .from('records')
        .select('*, branches(name)');

      if (selectedBranch !== 'all') {
        query = query.eq('branch_id', selectedBranch);
      }

      if (dateRange !== 'all') {
        const daysToSubtract = {
          '7d': 7,
          '30d': 30,
          '90d': 90,
        }[dateRange] || 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysToSubtract);
        query = query.gte('date', startDate.toISOString().split('T')[0]);
      }

      const { data: records, error } = await query;

      if (error) {
        console.error('Error fetching records:', error);
        return;
      }

      const safeRecords = records || [];
      console.log('Raw fetched records:', safeRecords);

      // Calculate metrics for each type
      const metrics: DashboardMetrics = {
        handover: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
        deposits: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
        invoices: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 }
      };

      ['handover', 'deposits', 'invoices'].forEach(type => {
        const { currentStreak, longestStreak } = calculateStreak(safeRecords, type);
        const typeMetrics = metrics[type as keyof DashboardMetrics];
        
        typeMetrics.total = safeRecords.length;
        typeMetrics.approved = safeRecords.filter(
          r => r[`${type}_status`]?.toLowerCase() === 'approved'
        ).length;
        typeMetrics.rejected = safeRecords.filter(
          r => r[`${type}_status`]?.toLowerCase() === 'rejected'
        ).length;
        typeMetrics.streak = currentStreak;
        typeMetrics.longestStreak = longestStreak;
      });

      setPerformanceMetrics(metrics);

      // Calculate success rates by date
      const recordsByDate = safeRecords.reduce((acc: { [key: string]: { total: number, successful: number } }, record: any) => {
        const date = record.date;
        if (!acc[date]) {
          acc[date] = { total: 0, successful: 0 };
        }
        acc[date].total++;
        
        const isSuccessful = ['handover_status', 'deposit_status', 'invoice_status'].every(
          status => record[status]?.toLowerCase() === 'approved'
        );
        
        if (isSuccessful) {
          acc[date].successful++;
        }
        return acc;
      }, {});

      const historyData = Object.entries(recordsByDate)
        .map(([date, stats]) => ({
          date,
          successRate: (stats.successful / stats.total) * 100
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      console.log('Processed history data:', historyData);
      setSubmissionHistory(historyData);

      // Calculate branch streaks
      const branchMetrics = branches.map(branch => {
        const branchRecords = safeRecords.filter((r: any) => r.branch_id === branch.id);
        const streaks = {
          handover: calculateStreak(branchRecords, 'handover').currentStreak,
          deposits: calculateStreak(branchRecords, 'deposits').currentStreak,
          invoices: calculateStreak(branchRecords, 'invoices').currentStreak
        };
        
        const successRate = branchRecords.length > 0
          ? (branchRecords.filter((r: any) => 
              ['handover_status', 'deposit_status', 'invoice_status'].every(
                status => r[status]?.toLowerCase() === 'approved'
              )
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