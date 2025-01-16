import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/services/branchService";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/hooks/useDashboardData";
import { logger } from "@/utils/logger";

export const useManagerDashboard = () => {
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

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    logger.info("Branch selection changed", { 
      component: "ManagerDashboard",
      data: { selectedBranch: value }
    });
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    logger.info("Date range changed", {
      component: "ManagerDashboard",
      data: { dateRange: value }
    });
  };

  const handleError = () => {
    if (isError) {
      logger.error("Failed to load branches", { component: "ManagerDashboard" });
      toast({
        title: "Error",
        description: "Failed to load branches. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return {
    selectedBranch,
    dateRange,
    branches,
    submissionHistory,
    performanceMetrics,
    branchStreaks,
    handleBranchChange,
    handleDateRangeChange,
    handleError
  };
};