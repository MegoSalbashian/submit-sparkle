import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SubmissionHistoryItem } from "@/types/dashboard";
import { getChartConfig } from "@/utils/chart/successRateChartConfig";

interface SuccessRateChartProps {
  data: SubmissionHistoryItem[];
}

export const SuccessRateChart = ({ data }: SuccessRateChartProps) => {
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

  const config = getChartConfig(data);

  return (
    <Card className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Success Rate History</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={config.margin}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...config.xAxisConfig} />
            <YAxis {...config.yAxisConfig} />
            <Tooltip 
              formatter={config.tooltipConfig.formatter}
              labelFormatter={config.tooltipConfig.labelFormatter}
            />
            <Line {...config.lineConfig} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};