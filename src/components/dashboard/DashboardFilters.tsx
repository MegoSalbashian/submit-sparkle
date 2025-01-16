import React from "react";
import { BranchSelector } from "./filters/BranchSelector";
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
      <BranchSelector
        selectedBranch={selectedBranch}
        onBranchChange={onBranchChange}
        branches={branches}
      />
      
      <DateRangeSelector 
        value={dateRange} 
        onValueChange={onDateRangeChange} 
      />
    </div>
  );
};