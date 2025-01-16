import { useSubmissionHistory } from "./dashboard/useSubmissionHistory";
import { usePerformanceMetrics } from "./dashboard/usePerformanceMetrics";
import { useBranchStreaks } from "./dashboard/useBranchStreaks";
import { Branch } from "@/services/branchService";
import { DashboardMetrics } from "@/types/dashboard";

export const useDashboardData = (
  selectedBranch: string,
  dateRange: string,
  branches: Branch[]
) => {
  const submissionHistory = useSubmissionHistory(selectedBranch, dateRange);
  const performanceMetrics: DashboardMetrics = {
    handover: usePerformanceMetrics({ type: 'handover' }),
    deposits: usePerformanceMetrics({ type: 'deposits' }),
    invoices: usePerformanceMetrics({ type: 'invoices' })
  };
  const branchStreaks = useBranchStreaks(selectedBranch, dateRange, branches);

  return {
    submissionHistory,
    performanceMetrics,
    branchStreaks
  };
};