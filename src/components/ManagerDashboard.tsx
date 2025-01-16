import React, { useEffect } from "react";
import { PerformanceCard } from "./dashboard/PerformanceCard";
import { SuccessRateChart } from "./dashboard/SuccessRateChart";
import { BranchOverviewTable } from "./dashboard/BranchOverviewTable";
import { DashboardFilters } from "./dashboard/DashboardFilters";
import { useManagerDashboard } from "@/hooks/useManagerDashboard";
import { DashboardMetrics } from "@/types/dashboard";

export const ManagerDashboard = () => {
  const {
    selectedBranch,
    dateRange,
    branches,
    submissionHistory,
    performanceMetrics,
    branchStreaks,
    handleBranchChange,
    handleDateRangeChange,
    handleError
  } = useManagerDashboard();

  useEffect(() => {
    handleError();
  }, [handleError]);

  // Initialize default metrics to prevent undefined access
  const defaultMetrics: DashboardMetrics = {
    handover: {
      total: 0,
      approved: 0,
      rejected: 0,
      streak: 0,
      longestStreak: 0
    },
    deposits: {
      total: 0,
      approved: 0,
      rejected: 0,
      streak: 0,
      longestStreak: 0
    },
    invoices: {
      total: 0,
      approved: 0,
      rejected: 0,
      streak: 0,
      longestStreak: 0
    }
  };

  const metrics = performanceMetrics || defaultMetrics;

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
          streakValue={metrics.handover.streak}
          longestStreak={metrics.handover.longestStreak}
          total={metrics.handover.total}
          approved={metrics.handover.approved}
          rejected={metrics.handover.rejected}
          type="handover"
        />
        
        <PerformanceCard
          title="Deposits Performance"
          streakValue={metrics.deposits.streak}
          longestStreak={metrics.deposits.longestStreak}
          total={metrics.deposits.total}
          approved={metrics.deposits.approved}
          rejected={metrics.deposits.rejected}
          type="deposits"
        />
        
        <PerformanceCard
          title="Invoice Performance"
          streakValue={metrics.invoices.streak}
          longestStreak={metrics.invoices.longestStreak}
          total={metrics.invoices.total}
          approved={metrics.invoices.approved}
          rejected={metrics.invoices.rejected}
          type="invoices"
        />
      </div>

      <SuccessRateChart data={submissionHistory} />
      
      <BranchOverviewTable branches={branchStreaks} />
    </div>
  );
};