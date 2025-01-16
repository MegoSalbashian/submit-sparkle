import React from "react";
import { Card } from "@/components/ui/card";
import { StreakCounter } from "../StreakCounter";
import { MetricsDisplay } from "./performance/MetricsDisplay";
import { usePerformanceMetrics } from "@/hooks/dashboard/usePerformanceMetrics";
import { SubmissionType } from "@/types/dashboard";

interface PerformanceCardProps {
  title: string;
  streakValue: number;
  longestStreak: number;
  total: number;
  approved: number;
  rejected: number;
  type: SubmissionType;
}

export const PerformanceCard = ({
  title,
  streakValue,
  longestStreak,
  total,
  approved,
  rejected,
  type
}: PerformanceCardProps) => {
  const { rejectedLabel } = usePerformanceMetrics({
    streakValue,
    longestStreak,
    total,
    approved,
    rejected,
    type
  });

  return (
    <Card className="dashboard-card">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <StreakCounter 
        value={streakValue} 
        longestStreak={longestStreak}
        label="Days" 
        type={type} 
      />
      <MetricsDisplay
        total={total}
        approved={approved}
        rejected={rejected}
        rejectedLabel={rejectedLabel}
      />
    </Card>
  );
};