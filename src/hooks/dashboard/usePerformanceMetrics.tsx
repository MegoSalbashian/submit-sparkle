import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateMetrics } from "@/utils/statusUtils";

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

export const usePerformanceMetrics = (selectedBranch: string, dateRange: string) => {
  const [performanceMetrics, setPerformanceMetrics] = useState<DashboardMetrics>({
    handover: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
    deposits: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
    invoices: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 }
  });

  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      try {
        let query = supabase.from('records').select('*');

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

        console.log('Calculated metrics:', metrics);
        setPerformanceMetrics(metrics);
      } catch (error) {
        console.error('Error in fetchPerformanceMetrics:', error);
      }
    };

    fetchPerformanceMetrics();
  }, [selectedBranch, dateRange]);

  return performanceMetrics;
};