import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isSuccessfulStatus } from "@/utils/statusUtils";
import { SubmissionHistoryItem } from "@/types/dashboard";

export const useSubmissionHistory = (selectedBranch: string, dateRange: string) => {
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([]);

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
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
        
        // Calculate success rates by date
        const recordsByDate = safeRecords.reduce((acc: { [key: string]: { total: number, successful: number } }, record) => {
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
      } catch (error) {
        console.error('Error in fetchSubmissionHistory:', error);
      }
    };

    fetchSubmissionHistory();
  }, [selectedBranch, dateRange]);

  return submissionHistory;
};