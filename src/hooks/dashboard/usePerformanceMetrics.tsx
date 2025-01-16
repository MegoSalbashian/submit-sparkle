import { SubmissionType } from "@/types/dashboard";

interface PerformanceMetricsProps {
  streakValue: number;
  longestStreak: number;
  total: number;
  approved: number;
  rejected: number;
  type: SubmissionType;
}

export const usePerformanceMetrics = ({
  streakValue,
  longestStreak,
  total,
  approved,
  rejected,
  type
}: PerformanceMetricsProps) => {
  const getRejectedLabel = (type: SubmissionType) => {
    return type === 'invoices' ? 'Missing invoices' : 'Rejected';
  };

  const getSuccessRate = () => {
    if (total === 0) return 0;
    return ((approved / total) * 100).toFixed(1);
  };

  return {
    rejectedLabel: getRejectedLabel(type),
    successRate: getSuccessRate(),
  };
};