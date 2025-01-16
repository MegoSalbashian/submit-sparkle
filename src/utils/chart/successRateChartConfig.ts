import { SubmissionHistoryItem } from "@/types/dashboard";

export const getChartConfig = (data: SubmissionHistoryItem[]) => ({
  margin: { top: 20, right: 30, left: 20, bottom: 60 },
  xAxisConfig: {
    dataKey: "date",
    tickFormatter: (value: string) => new Date(value).toLocaleDateString(),
    angle: -45,
    textAnchor: "end",
    height: 60,
  },
  yAxisConfig: {
    domain: [0, 100] as [number, number],
    tickFormatter: (value: number) => `${value.toFixed(1)}%`,
  },
  tooltipConfig: {
    formatter: (value: number) => [`${value.toFixed(1)}%`, 'Success Rate'],
    labelFormatter: (label: string) => new Date(label).toLocaleDateString(),
  },
  lineConfig: {
    type: "monotone" as const,
    dataKey: "successRate",
    stroke: "#22c55e",
    strokeWidth: 2,
    name: "Success Rate",
    dot: false,
  },
});