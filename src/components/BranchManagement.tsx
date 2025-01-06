import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { branches, addBranch } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const BranchManagement = () => {
  const [branchName, setBranchName] = useState("");
  const [editingBranch, setEditingBranch] = useState<{ id: string; name: string } | null>(null);
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

    if (editingBranch) {
      // Update existing branch
      const branchIndex = branches.findIndex(b => b.id === editingBranch.id);
      if (branchIndex !== -1) {
        branches[branchIndex].name = branchName.trim();
        toast({
          title: "Success",
          description: "Branch updated successfully",
        });
        setEditingBranch(null);
      }
    } else {
      // Add new branch
      addBranch(branchName.trim());
      toast({
        title: "Success",
        description: "Branch added successfully",
      });
    }
    setBranchName("");
  };

  const handleEdit = (branch: { id: string; name: string }) => {
    setEditingBranch(branch);
    setBranchName(branch.name);
  };

  const handleCancel = () => {
    setEditingBranch(null);
    setBranchName("");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingBranch ? "Edit Branch" : "Add New Branch"}
        </h2>
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
          <div className="flex gap-2">
            <Button type="submit">
              {editingBranch ? "Update Branch" : "Add Branch"}
            </Button>
            {editingBranch && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Branches</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.id}</TableCell>
                <TableCell>{branch.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(branch)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};