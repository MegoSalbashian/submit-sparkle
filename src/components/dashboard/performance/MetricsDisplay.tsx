import React from "react";

interface MetricsDisplayProps {
  total: number;
  approved: number;
  rejected: number;
  rejectedLabel: string;
}

export const MetricsDisplay = ({
  total,
  approved,
  rejected,
  rejectedLabel
}: MetricsDisplayProps) => {
  return (
    <div className="space-y-2 mt-4">
      <p className="text-sm text-muted-foreground">
        Total: {total}
      </p>
      <p className="text-sm text-emerald-600">
        Approved: {approved}
      </p>
      <p className="text-sm text-red-600">
        {rejectedLabel}: {rejected}
      </p>
    </div>
  );
};