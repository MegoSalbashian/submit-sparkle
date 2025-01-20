import React from "react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/services/branchService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BranchSelectorProps {
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
}

export const BranchSelector = ({
  selectedBranch,
  setSelectedBranch,
}: BranchSelectorProps) => {
  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="branch">Branch</Label>
      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
        <SelectTrigger>
          <SelectValue placeholder="Select branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};