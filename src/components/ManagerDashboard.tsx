import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBranches } from "@/services/branchService";
import { DateRangeSelector } from "./DateRangeSelector";
import { PerformanceCard } from "./dashboard/PerformanceCard";
import { SuccessRateChart } from "./dashboard/SuccessRateChart";
import { BranchOverviewTable } from "./dashboard/BranchOverviewTable";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ManagerDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const [submissionHistory, setSubmissionHistory] = useState<any[]>([]);
  const { toast } = useToast();
  
  const { data: branches = [], isError } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load branches. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  useEffect(() => {
    const fetchRecords = async () => {
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
        'all': 365 // Default to showing up to a year for "all time"
      }[dateRange];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToSubtract);

      query = query.gte('date', startDate.toISOString().split('T')[0]);

      const { data: records, error } = await query;

      if (error) {
        console.error('Error fetching records:', error);
        return;
      }

      // Group records by date and calculate success rates
      const groupedRecords = records.reduce((acc: any, record: any) => {
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

      // Convert to array format needed for chart
      const historyData = Object.entries(groupedRecords).map(([date, stats]: [string, any]) => ({
        date,
        successRate: (stats.successful / stats.total) * 100
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setSubmissionHistory(historyData);
    };

    fetchRecords();
  }, [selectedBranch, dateRange]);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    console.log("Selected branch:", value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    console.log("Selected date range:", value);
  };

  const branchStreaks = branches.map(branch => {
    // Calculate streaks based on actual data
    return {
      ...branch,
      streaks: {
        handover: 0,
        deposits: 0,
        invoices: 0
      },
      successRate: 0
    };
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        
        <div className="flex gap-4">
          <Select value={selectedBranch} onValueChange={handleBranchChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches (Average)</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DateRangeSelector value={dateRange} onValueChange={handleDateRangeChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PerformanceCard
          title="Handover Performance"
          streakValue={0}
          longestStreak={0}
          total={0}
          approved={0}
          rejected={0}
          type="handover"
        />
        
        <PerformanceCard
          title="Deposits Performance"
          streakValue={0}
          longestStreak={0}
          total={0}
          approved={0}
          rejected={0}
          type="deposits"
        />
        
        <PerformanceCard
          title="Invoice Performance"
          streakValue={0}
          longestStreak={0}
          total={0}
          approved={0}
          rejected={0}
          type="invoices"
        />
      </div>

      <SuccessRateChart data={submissionHistory} />
      
      <BranchOverviewTable branches={branchStreaks} />
    </div>
  );
};