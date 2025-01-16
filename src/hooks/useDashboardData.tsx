import { useSubmissionHistory } from "./dashboard/useSubmissionHistory";
import { usePerformanceMetrics } from "./dashboard/usePerformanceMetrics";
import { useBranchStreaks } from "./dashboard/useBranchStreaks";
import { Branch } from "@/services/branchService";

export const useDashboardData = (
  selectedBranch: string,
  dateRange: string,
  branches: Branch[]
) => {
  const submissionHistory = useSubmissionHistory(selectedBranch, dateRange);
  const performanceMetrics = usePerformanceMetrics(selectedBranch, dateRange);
  const branchStreaks = useBranchStreaks(selectedBranch, dateRange, branches);

  return {
    submissionHistory,
    performanceMetrics,
    branchStreaks
  };
};