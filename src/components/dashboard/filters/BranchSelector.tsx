import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Branch } from "@/services/branchService";

interface BranchSelectorProps {
  selectedBranch: string;
  onBranchChange: (value: string) => void;
  branches: Branch[];
}

export const BranchSelector = ({
  selectedBranch,
  onBranchChange,
  branches
}: BranchSelectorProps) => {
  return (
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
  );
};