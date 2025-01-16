import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addBranch, updateBranch, deleteBranch, getBranches, type Branch } from "@/services/branchService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const BranchManagement = () => {
  const [newBranchName, setNewBranchName] = useState("");
  const [editingBranch, setEditingBranch] = useState<{ id: string; name: string; editedName: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      toast({
        title: "Error",
        description: "Branch name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await addBranch(newBranchName.trim());
      await queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: "Success",
        description: "Branch added successfully",
      });
      setNewBranchName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add branch",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch({ ...branch, editedName: branch.name });
  };

  const handleCancelEdit = () => {
    setEditingBranch(null);
  };

  const handleUpdateBranch = async (branch: { id: string; name: string; editedName: string }) => {
    try {
      await updateBranch(branch.id, branch.editedName.trim());
      await queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: "Success",
        description: "Branch updated successfully",
      });
      setEditingBranch(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update branch",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    try {
      await deleteBranch(branchId);
      await queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Branch</h2>
        <form onSubmit={handleAddBranch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newBranchName">Branch Name</Label>
            <Input
              id="newBranchName"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="Enter branch name"
            />
          </div>
          <Button type="submit">Add Branch</Button>
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
                <TableCell>
                  {editingBranch?.id === branch.id ? (
                    <Input
                      value={editingBranch.editedName}
                      onChange={(e) => setEditingBranch({ ...editingBranch, editedName: e.target.value })}
                    />
                  ) : (
                    branch.name
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {editingBranch?.id === branch.id ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUpdateBranch(editingBranch)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(branch)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBranch(branch.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};