import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBranches } from "@/services/branchService";
import { generateMockData } from "@/services/mockDataGenerator";
import { DateRangeSelector } from "./DateRangeSelector";
import { PerformanceCard } from "./dashboard/PerformanceCard";
import { SuccessRateChart } from "./dashboard/SuccessRateChart";
import { BranchOverviewTable } from "./dashboard/BranchOverviewTable";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const ManagerDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const { toast } = useToast();
  
  const { data: branches = [], isError } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load branches. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);
  
  const mockData = generateMockData(selectedBranch, dateRange);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    console.log("Selected branch:", value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    console.log("Selected date range:", value);
  };

  const branchStreaks = branches.map(branch => {
    const branchData = generateMockData(branch.id, dateRange);
    return {
      ...branch,
      streaks: branchData.streaks,
      successRate: branchData.submissionHistory[0]?.successRate || 0
    };
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        
        <div className="flex gap-4">
          <Select value={selectedBranch} onValueChange={handleBranchChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches (Average)</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DateRangeSelector value={dateRange} onValueChange={handleDateRangeChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PerformanceCard
          title="Handover Performance"
          streakValue={mockData.streaks.handover}
          longestStreak={mockData.longestStreaks.handover}
          total={mockData.totalSubmissions.handover}
          approved={mockData.approvedSubmissions.handover}
          rejected={mockData.rejectedSubmissions.handover}
          type="handover"
        />
        
        <PerformanceCard
          title="Deposits Performance"
          streakValue={mockData.streaks.deposits}
          longestStreak={mockData.longestStreaks.deposits}
          total={mockData.totalSubmissions.deposits}
          approved={mockData.approvedSubmissions.deposits}
          rejected={mockData.rejectedSubmissions.deposits}
          type="deposits"
        />
        
        <PerformanceCard
          title="Invoice Performance"
          streakValue={mockData.streaks.invoices}
          longestStreak={mockData.longestStreaks.invoices}
          total={mockData.totalSubmissions.invoices}
          approved={mockData.approvedSubmissions.invoices}
          rejected={mockData.rejectedSubmissions.invoices}
          type="invoices"
        />
      </div>

      <SuccessRateChart data={mockData.submissionHistory} />
      
      <BranchOverviewTable branches={branchStreaks} />
    </div>
  );
};