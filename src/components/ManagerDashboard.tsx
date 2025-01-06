import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { branches, generateMockData } from "@/data/mockData";
import { StreakCounter } from "./StreakCounter";
import { DateRangeSelector } from "./DateRangeSelector";

export const ManagerDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  
  const mockData = generateMockData(selectedBranch);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        
        <div className="flex gap-4">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DateRangeSelector value={dateRange} onValueChange={setDateRange} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-4">Handover Streak</h3>
          <StreakCounter value={mockData.streaks.handover} label="Days" type="handover" />
        </Card>
        
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-4">Deposits Streak</h3>
          <StreakCounter value={mockData.streaks.deposits} label="Days" type="deposits" />
        </Card>
        
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-4">Invoice Streak</h3>
          <StreakCounter value={mockData.streaks.invoices} label="Days" type="invoices" />
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
              <Legend />
              <Line
                type="monotone"
                dataKey="handover"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Handover"
              />
              <Line
                type="monotone"
                dataKey="deposits"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                name="Deposits"
              />
              <Line
                type="monotone"
                dataKey="invoices"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="Invoices"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-4">Handover Performance</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total: {mockData.totalSubmissions.handover}</p>
            <p className="text-sm text-secondary">Approved: {mockData.approvedSubmissions.handover}</p>
            <p className="text-sm text-destructive">Rejected: {mockData.rejectedSubmissions.handover}</p>
          </div>
        </Card>
        
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-4">Deposits Performance</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total: {mockData.totalSubmissions.deposits}</p>
            <p className="text-sm text-secondary">Approved: {mockData.approvedSubmissions.deposits}</p>
            <p className="text-sm text-destructive">Rejected: {mockData.rejectedSubmissions.deposits}</p>
          </div>
        </Card>
        
        <Card className="dashboard-card">
          <h3 className="text-lg font-medium mb-4">Invoice Performance</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total: {mockData.totalSubmissions.invoices}</p>
            <p className="text-sm text-secondary">Approved: {mockData.approvedSubmissions.invoices}</p>
            <p className="text-sm text-destructive">Rejected: {mockData.rejectedSubmissions.invoices}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};