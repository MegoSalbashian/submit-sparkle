import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Branch } from "@/services/branchService";
import { calculateBranchStreak } from "@/utils/statusUtils";
import { isSuccessfulStatus } from "@/utils/statusUtils";

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

export const useBranchStreaks = (
  selectedBranch: string,
  dateRange: string,
  branches: Branch[]
) => {
  const [branchStreaks, setBranchStreaks] = useState<BranchStreak[]>([]);

  useEffect(() => {
    const fetchBranchStreaks = async () => {
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
        console.error('Error in fetchBranchStreaks:', error);
      }
    };

    fetchBranchStreaks();
  }, [selectedBranch, dateRange, branches]);

  return branchStreaks;
};