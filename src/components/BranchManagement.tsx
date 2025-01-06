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
  const [newBranchName, setNewBranchName] = useState("");
  const [editingBranch, setEditingBranch] = useState<{ id: string; name: string; editedName: string } | null>(null);
  const { toast } = useToast();

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      toast({
        title: "Error",
        description: "Branch name is required",
        variant: "destructive",
      });
      return;
    }

    addBranch(newBranchName.trim());
    toast({
      title: "Success",
      description: "Branch added successfully",
    });
    setNewBranchName("");
  };

  const handleEdit = (branch: { id: string; name: string }) => {
    setEditingBranch({ ...branch, editedName: branch.name });
  };

  const handleCancelEdit = () => {
    setEditingBranch(null);
  };

  const handleUpdateBranch = (branch: { id: string; name: string; editedName: string }) => {
    const branchIndex = branches.findIndex(b => b.id === branch.id);
    if (branchIndex !== -1) {
      branches[branchIndex].name = branch.editedName.trim();
      toast({
        title: "Success",
        description: "Branch updated successfully",
      });
      setEditingBranch(null);
    }
  };

  const handleDeleteBranch = (branchId: string) => {
    const branchIndex = branches.findIndex(b => b.id === branchId);
    if (branchIndex !== -1) {
      branches.splice(branchIndex, 1);
      toast({
        title: "Success",
        description: "Branch deleted successfully",
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