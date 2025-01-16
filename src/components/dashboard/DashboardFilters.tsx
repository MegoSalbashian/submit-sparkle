import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeSelector } from "../DateRangeSelector";
import { Branch } from "@/services/branchService";

interface DashboardFiltersProps {
  selectedBranch: string;
  onBranchChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  branches: Branch[];
}

export const DashboardFilters = ({
  selectedBranch,
  onBranchChange,
  dateRange,
  onDateRangeChange,
  branches
}: DashboardFiltersProps) => {
  return (
    <div className="flex gap-4">
      <Select value={selectedBranch} onValueChange={onBranchChange}>
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
      
      <DateRangeSelector value={dateRange} onValueChange={onDateRangeChange} />
    </div>
  );
};