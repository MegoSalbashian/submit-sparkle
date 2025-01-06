import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addBranch } from "@/data/mockData";

export const AddBranchForm = () => {
  const [branchName, setBranchName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) {
      toast({
        title: "Error",
        description: "Branch name is required",
        variant: "destructive",
      });
      return;
    }

    addBranch(branchName.trim());
    toast({
      title: "Success",
      description: "Branch added successfully",
    });
    setBranchName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="branchName">Branch Name</Label>
        <Input
          id="branchName"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="Enter branch name"
        />
      </div>
      <Button type="submit">Add Branch</Button>
    </form>
  );
};