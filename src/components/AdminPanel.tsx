import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { branches } from "@/data/mockData";

export const AdminPanel = () => {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [managerName, setManagerName] = useState<string>("");
  const [depositStatus, setDepositStatus] = useState<string>("");
  const [handoverStatus, setHandoverStatus] = useState<string>("");
  const [invoiceStatus, setInvoiceStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedBranch || !managerName || !depositStatus || !handoverStatus || !invoiceStatus) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would update a database
    // For now, we'll just show a success message
    toast({
      title: "Success",
      description: "Record has been saved successfully.",
    });

    // Reset form
    setSelectedBranch("");
    setManagerName("");
    setDepositStatus("pending");
    setHandoverStatus("pending");
    setInvoiceStatus("pending");
    setNotes("");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div className="space-y-2">
              <Label htmlFor="managerName">Shop Manager Name</Label>
              <Input 
                id="managerName" 
                placeholder="Enter manager name" 
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="depositStatus">Deposit Slip Status</Label>
              <Select value={depositStatus} onValueChange={setDepositStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="handoverStatus">Handover Form Status</Label>
              <Select value={handoverStatus} onValueChange={setHandoverStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceStatus">Invoice Status</Label>
              <Select value={invoiceStatus} onValueChange={setInvoiceStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              placeholder="Add any additional notes" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full md:w-auto">
            Save Record
          </Button>
        </form>
      </Card>
    </div>
  );
};