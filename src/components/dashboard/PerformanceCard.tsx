import React from "react";
import { Card } from "@/components/ui/card";
import { StreakCounter } from "../StreakCounter";
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
  const getRejectedLabel = (type: SubmissionType) => {
    return type === 'invoices' ? 'Missing invoices' : 'Rejected';
  };

  return (
    <Card className="dashboard-card">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <StreakCounter 
        value={streakValue} 
        longestStreak={longestStreak}
        label="Days" 
        type={type} 
      />
      <div className="space-y-2 mt-4">
        <p className="text-sm text-muted-foreground">
          Total: {total}
        </p>
        <p className="text-sm text-emerald-600">
          Approved: {approved}
        </p>
        <p className="text-sm text-red-600">
          {getRejectedLabel(type)}: {rejected}
        </p>
      </div>
    </Card>
  );
};