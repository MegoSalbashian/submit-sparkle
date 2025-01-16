import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionType, PerformanceMetrics } from "@/types/dashboard";
import { logger } from "@/utils/logger";

interface PerformanceMetricsProps {
  type: SubmissionType;
}

export const usePerformanceMetrics = ({ type }: PerformanceMetricsProps): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    total: 0,
    approved: 0,
    rejected: 0,
    streak: 0,
    longestStreak: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const statusField = `${type}_status`;
        
        // Fetch all records for this type
        const { data: records, error } = await supabase
          .from('records')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          logger.error('Error fetching records:', { 
            component: 'usePerformanceMetrics',
            data: error
          });
          return;
        }

        if (!records) {
          return;
        }

        // Calculate metrics
        const total = records.length;
        const approved = records.filter(record => record[statusField] === 'approved').length;
        const rejected = records.filter(record => 
          type === 'invoices' 
            ? record[statusField]?.toLowerCase().includes('missing')
            : record[statusField] === 'rejected'
        ).length;

        // Calculate current streak
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        for (const record of records) {
          if (record[statusField] === 'approved') {
            tempStreak++;
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
            if (currentStreak === 0) {
              currentStreak = tempStreak;
            }
          } else {
            tempStreak = 0;
          }
        }

        setMetrics({
          total,
          approved,
          rejected,
          streak: currentStreak,
          longestStreak
        });

        logger.info('Performance metrics calculated:', {
          component: 'usePerformanceMetrics',
          data: {
            type,
            total,
            approved,
            rejected,
            currentStreak,
            longestStreak
          }
        });

      } catch (error) {
        logger.error('Error in fetchMetrics:', {
          component: 'usePerformanceMetrics',
          data: error
        });
      }
    };

    fetchMetrics();
  }, [type]);

  return metrics;
};