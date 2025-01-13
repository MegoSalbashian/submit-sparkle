import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface SubmissionHistoryItem {
  date: string;
  successRate: number;
}

interface SuccessRateChartProps {
  data: SubmissionHistoryItem[];
}

export const SuccessRateChart = ({ data }: SuccessRateChartProps) => {
  const successRates = data.map(item => item.successRate);
  const minRate = Math.floor(Math.min(...successRates));
  const maxRate = Math.ceil(Math.max(...successRates));
  const padding = Math.round((maxRate - minRate) * 0.1);

  return (
    <Card className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Success Rate History</h3>
      <div className="chart-container" style={{ height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              domain={[Math.max(0, minRate - padding), maxRate + padding]}
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