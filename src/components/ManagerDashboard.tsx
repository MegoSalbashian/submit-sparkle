import React, { useState } from "react";
import { getBranches } from "@/services/branchService";
import { PerformanceCard } from "./dashboard/PerformanceCard";
import { SuccessRateChart } from "./dashboard/SuccessRateChart";
import { BranchOverviewTable } from "./dashboard/BranchOverviewTable";
import { DashboardFilters } from "./dashboard/DashboardFilters";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/hooks/useDashboardData";

export const ManagerDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const { toast } = useToast();
  
  const { data: branches = [], isError } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  const { 
    submissionHistory,
    performanceMetrics,
    branchStreaks
  } = useDashboardData(selectedBranch, dateRange, branches);

  React.useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load branches. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

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
        
        <DashboardFilters
          selectedBranch={selectedBranch}
          onBranchChange={handleBranchChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          branches={branches}
        />
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