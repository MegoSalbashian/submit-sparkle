import { SubmissionType, PerformanceMetrics } from "@/types/dashboard";

interface PerformanceMetricsProps {
  type: SubmissionType;
}

export const usePerformanceMetrics = ({ type }: PerformanceMetricsProps): PerformanceMetrics => {
  // This is a mock implementation - replace with actual data fetching logic
  return {
    total: 0,
    approved: 0,
    rejected: 0,
    streak: 0,
    longestStreak: 0
  };
};