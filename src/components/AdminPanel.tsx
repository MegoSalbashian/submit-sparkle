import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { branches } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepositSlipForm } from "./forms/DepositSlipForm";
import { HandoverForm } from "./forms/HandoverForm";
import { InvoiceForm } from "./forms/InvoiceForm";
import { ProcessedRecords } from "./ProcessedRecords";
import { BranchManagement } from "./BranchManagement";

const initialProcessedRecords = [
  {
    id: "1",
    branchName: "Main Branch",
    date: "2024-03-20",
    depositOdooSession: "DS001",
    handoverOdooSession: "HO001",
    depositStatus: "Approved",
    handoverStatus: "Approved",
    invoiceStatus: "Approved",
  },
  {
    id: "2",
    branchName: "Downtown",
    date: "2024-03-19",
    depositOdooSession: "DS002",
    handoverOdooSession: "HO002",
    depositStatus: "Pending",
    handoverStatus: "Approved",
    invoiceStatus: "Missing invoices",
  },
];

export const AdminPanel = () => {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [processedRecords, setProcessedRecords] = useState(initialProcessedRecords);
  
  // Form States
  const [depositStatus, setDepositStatus] = useState<string>("");
  const [depositDate, setDepositDate] = useState<string>("");
  const [depositOdooSession, setDepositOdooSession] = useState<string>("");
  const [depositNotes, setDepositNotes] = useState<string>("");
  
  const [handoverStatus, setHandoverStatus] = useState<string>("");
  const [handoverDate, setHandoverDate] = useState<string>("");
  const [handoverOdooSession, setHandoverOdooSession] = useState<string>("");
  const [handoverNotes, setHandoverNotes] = useState<string>("");
  
  const [invoiceStatus, setInvoiceStatus] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");

  const handleEdit = (record: typeof initialProcessedRecords[0]) => {
    setIsEditing(true);
    setEditingId(record.id);
    
    // Find the branch by name and set it
    const branch = branches.find(b => b.name === record.branchName);
    if (branch) {
      setSelectedBranch(branch.id);
    }
    
    // Set all form values
    setDepositDate(record.date);
    setDepositOdooSession(record.depositOdooSession);
    setDepositStatus(record.depositStatus.toLowerCase());
    
    setHandoverDate(record.date);
    setHandoverOdooSession(record.handoverOdooSession);
    setHandoverStatus(record.handoverStatus.toLowerCase());
    
    setInvoiceDate(record.date);
    setInvoiceStatus(record.invoiceStatus.toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBranch) {
      toast({
        title: "Error",
        description: "Please select a branch.",
        variant: "destructive",
      });
      return;
    }

    const selectedBranchData = branches.find(b => b.id === selectedBranch);
    
    if (isEditing && editingId) {
      // Update existing record
      setProcessedRecords(prev => prev.map(record => {
        if (record.id === editingId) {
          return {
            ...record,
            branchName: selectedBranchData?.name || "",
            date: depositDate,
            depositOdooSession,
            handoverOdooSession,
            depositStatus: depositStatus.charAt(0).toUpperCase() + depositStatus.slice(1),
            handoverStatus: handoverStatus.charAt(0).toUpperCase() + handoverStatus.slice(1),
            invoiceStatus: invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1),
          };
        }
        return record;
      }));
      
      toast({
        title: "Success",
        description: "Record has been updated successfully.",
      });
    } else {
      // Add new record
      const newRecord = {
        id: Date.now().toString(),
        branchName: selectedBranchData?.name || "",
        date: depositDate,
        depositOdooSession,
        handoverOdooSession,
        depositStatus: depositStatus.charAt(0).toUpperCase() + depositStatus.slice(1),
        handoverStatus: handoverStatus.charAt(0).toUpperCase() + handoverStatus.slice(1),
        invoiceStatus: invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1),
      };
      
      setProcessedRecords(prev => [...prev, newRecord]);
      
      toast({
        title: "Success",
        description: "New record has been added successfully.",
      });
    }

    // Reset form
    setIsEditing(false);
    setEditingId(null);
    setSelectedBranch("");
    setDepositStatus("");
    setDepositDate("");
    setDepositOdooSession("");
    setDepositNotes("");
    setHandoverStatus("");
    setHandoverDate("");
    setHandoverOdooSession("");
    setHandoverNotes("");
    setInvoiceStatus("");
    setInvoiceDate("");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Branch Management</h2>
          <BranchManagement />
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
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

            <DepositSlipForm
              depositDate={depositDate}
              setDepositDate={setDepositDate}
              depositOdooSession={depositOdooSession}
              setDepositOdooSession={setDepositOdooSession}
              depositStatus={depositStatus}
              setDepositStatus={setDepositStatus}
              depositNotes={depositNotes}
              setDepositNotes={setDepositNotes}
            />

            <HandoverForm
              handoverDate={handoverDate}
              setHandoverDate={setHandoverDate}
              handoverOdooSession={handoverOdooSession}
              setHandoverOdooSession={setHandoverOdooSession}
              handoverStatus={handoverStatus}
              setHandoverStatus={setHandoverStatus}
              handoverNotes={handoverNotes}
              setHandoverNotes={setHandoverNotes}
            />

            <InvoiceForm
              invoiceDate={invoiceDate}
              setInvoiceDate={setInvoiceDate}
              invoiceStatus={invoiceStatus}
              setInvoiceStatus={setInvoiceStatus}
            />
            
            <Button type="submit" className="w-full md:w-auto">
              {isEditing ? "Update Record" : "Save Record"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <ProcessedRecords 
            records={processedRecords} 
            onEdit={handleEdit}
          />
        </Card>
      </div>
    </div>
  );
};
