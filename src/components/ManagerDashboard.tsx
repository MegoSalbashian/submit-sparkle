import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = {
  streak: 6,
  longestStreak: 15,
  totalSubmissions: 45,
  approvedSubmissions: 42,
  rejectedSubmissions: 3,
  submissionHistory: [
    { date: "Mon", submissions: 2 },
    { date: "Tue", submissions: 2 },
    { date: "Wed", submissions: 1 },
    { date: "Thu", submissions: 2 },
    { date: "Fri", submissions: 2 },
    { date: "Sat", submissions: 1 },
    { date: "Sun", submissions: 2 },
  ],
};

export const ManagerDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manager Dashboard</h1>
      
      <div className="stats-grid mb-8">
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-2">Current Streak</h3>
          <p className="streak-counter">{mockData.streak} days</p>
        </Card>
        
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-2">Longest Streak</h3>
          <p className="streak-counter">{mockData.longestStreak} days</p>
        </Card>
        
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-2">Success Rate</h3>
          <p className="streak-counter">
            {Math.round((mockData.approvedSubmissions / mockData.totalSubmissions) * 100)}%
          </p>
        </Card>
      </div>
      
      <Card className="dashboard-card mb-8">
        <h3 className="text-lg font-medium mb-4">Submission History</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.submissionHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <h3 className="text-lg font-medium mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
            <p className="text-2xl font-semibold">{mockData.totalSubmissions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-semibold text-secondary">
              {mockData.approvedSubmissions}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-semibold text-destructive">
              {mockData.rejectedSubmissions}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};