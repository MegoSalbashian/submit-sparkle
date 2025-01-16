import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Branch } from "@/services/branchService";
import { isSuccessfulStatus, calculateMetrics, calculateBranchStreak } from "@/utils/statusUtils";

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

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data with params:', { selectedBranch, dateRange });
      
      try {
        let query = supabase
          .from('records')
          .select('*');

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
        
        // Sort records by date in descending order (newest first)
        const sortedRecords = [...safeRecords].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Calculate metrics for each type
        const metrics: DashboardMetrics = {
          handover: calculateMetrics(sortedRecords, 'handover'),
          deposits: calculateMetrics(sortedRecords, 'deposits'),
          invoices: calculateMetrics(sortedRecords, 'invoices')
        };

        setPerformanceMetrics(metrics);

        // Calculate success rates by date
        const recordsByDate = sortedRecords.reduce((acc: { [key: string]: { total: number, successful: number } }, record) => {
          const date = record.date;
          if (!acc[date]) {
            acc[date] = { total: 0, successful: 0 };
          }
          
          acc[date].total++;
          
          const isSuccessful = 
            isSuccessfulStatus('handover', record.handover_status) &&
            isSuccessfulStatus('deposits', record.deposit_status) &&
            isSuccessfulStatus('invoices', record.invoice_status);
          
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

        setSubmissionHistory(historyData);

        // Calculate branch streaks
        const branchMetrics = branches.map(branch => {
          const branchRecords = sortedRecords.filter(r => r.branch_id === branch.id);
          
          const streaks = {
            handover: calculateBranchStreak(branchRecords, 'handover'),
            deposits: calculateBranchStreak(branchRecords, 'deposits'),
            invoices: calculateBranchStreak(branchRecords, 'invoices')
          };

          const successfulRecords = branchRecords.filter(record => 
            isSuccessfulStatus('handover', record.handover_status) &&
            isSuccessfulStatus('deposits', record.deposit_status) &&
            isSuccessfulStatus('invoices', record.invoice_status)
          );

          const successRate = branchRecords.length > 0
            ? (successfulRecords.length / branchRecords.length) * 100
            : 0;

          return {
            id: branch.id,
            name: branch.name,
            streaks,
            successRate
          };
        });

        setBranchStreaks(branchMetrics);

      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    fetchData();
  }, [selectedBranch, dateRange, branches]);

  return {
    submissionHistory,
    performanceMetrics,
    branchStreaks
  };
};