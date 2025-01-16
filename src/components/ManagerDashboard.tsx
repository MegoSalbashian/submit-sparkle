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
  const [performanceMetrics, setPerformanceMetrics] = useState({
    handover: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
    deposits: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
    invoices: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 }
  });
  const [branchStreaks, setBranchStreaks] = useState<any[]>([]);
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
      const metrics = {
        handover: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
        deposits: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 },
        invoices: { total: 0, approved: 0, rejected: 0, streak: 0, longestStreak: 0 }
      };

      ['handover', 'deposits', 'invoice'].forEach(type => {
        const statusKey = `${type}_status`;
        metrics[type].total = records.length;
        metrics[type].approved = records.filter(r => r[statusKey] === 'approved').length;
        metrics[type].rejected = records.filter(r => r[statusKey] === 'rejected').length;
        const { currentStreak, longestStreak } = calculateStreak(records, type);
        metrics[type].streak = currentStreak;
        metrics[type].longestStreak = longestStreak;
      });

      setPerformanceMetrics(metrics);

      // Calculate success rates for chart
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

      const historyData = Object.entries(groupedRecords).map(([date, stats]: [string, any]) => ({
        date,
        successRate: (stats.successful / stats.total) * 100
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setSubmissionHistory(historyData);

      // Calculate branch streaks
      const branchMetrics = branches.map(branch => {
        const branchRecords = records.filter((r: any) => r.branch_id === branch.id);
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

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    console.log("Selected branch:", value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    console.log("Selected date range:", value);
  };

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
          streakValue={performanceMetrics.handover.streak}
          longestStreak={performanceMetrics.handover.longestStreak}
          total={performanceMetrics.handover.total}
          approved={performanceMetrics.handover.approved}
          rejected={performanceMetrics.handover.rejected}
          type="handover"
        />
        
        <PerformanceCard
          title="Deposits Performance"
          streakValue={performanceMetrics.deposits.streak}
          longestStreak={performanceMetrics.deposits.longestStreak}
          total={performanceMetrics.deposits.total}
          approved={performanceMetrics.deposits.approved}
          rejected={performanceMetrics.deposits.rejected}
          type="deposits"
        />
        
        <PerformanceCard
          title="Invoice Performance"
          streakValue={performanceMetrics.invoices.streak}
          longestStreak={performanceMetrics.invoices.longestStreak}
          total={performanceMetrics.invoices.total}
          approved={performanceMetrics.invoices.approved}
          rejected={performanceMetrics.invoices.rejected}
          type="invoices"
        />
      </div>

      <SuccessRateChart data={submissionHistory} />
      
      <BranchOverviewTable branches={branchStreaks} />
    </div>
  );
};