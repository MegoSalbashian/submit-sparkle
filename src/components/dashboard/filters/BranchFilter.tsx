import React from "react";
import { BranchSelector } from "./BranchSelector";
import { Branch } from "@/services/branchService";

interface BranchFilterProps {
  selectedBranch: string;
  onBranchChange: (value: string) => void;
  branches: Branch[];
}

export const BranchFilter = ({
  selectedBranch,
  onBranchChange,
  branches
}: BranchFilterProps) => {
  return (
    <BranchSelector
      selectedBranch={selectedBranch}
      onBranchChange={onBranchChange}
      branches={branches}
    />
  );
};