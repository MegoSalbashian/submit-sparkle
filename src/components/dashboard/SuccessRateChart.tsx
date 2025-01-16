import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SubmissionHistoryItem {
  date: string;
  successRate: number;
}

interface SuccessRateChartProps {
  data: SubmissionHistoryItem[];
}

export const SuccessRateChart = ({ data }: SuccessRateChartProps) => {
  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <Card className="dashboard-card mb-8">
        <h3 className="text-lg font-medium mb-4">Success Rate History</h3>
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          No data available for the selected period
        </div>
      </Card>
    );
  }

  const successRates = data.map(item => item.successRate);
  const minRate = Math.min(...successRates, 0); // Ensure we include 0 as minimum
  const maxRate = Math.max(...successRates, 100); // Ensure we include 100 as maximum
  const padding = 5; // Fixed padding of 5% for better visualization

  return (
    <Card className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Success Rate History</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={[Math.max(0, minRate - padding), Math.min(100, maxRate + padding)]}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Success Rate']}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke="#22c55e"
              strokeWidth={2}
              name="Success Rate"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};