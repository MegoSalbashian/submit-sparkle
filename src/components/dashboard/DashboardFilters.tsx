import React from "react";
import { BranchFilter } from "./filters/BranchFilter";
import { DateRangeFilter } from "./filters/DateRangeFilter";
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
      <BranchFilter
        selectedBranch={selectedBranch}
        onBranchChange={onBranchChange}
        branches={branches}
      />
      
      <DateRangeFilter 
        value={dateRange} 
        onValueChange={onDateRangeChange} 
      />
    </div>
  );
};