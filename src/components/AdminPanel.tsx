import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { branches } from "@/data/mockData";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BranchManagement } from "./BranchManagement";
import { RecordsTab } from "./admin/RecordsTab";

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
    
    const branch = branches.find(b => b.name === record.branchName);
    if (branch) {
      setSelectedBranch(branch.id);
    }
    
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
      return;
    }

    const selectedBranchData = branches.find(b => b.id === selectedBranch);
    
    if (isEditing && editingId) {
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
    } else {
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
      
      <Tabs defaultValue="records" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="branches">Branch Management</TabsTrigger>
        </TabsList>

        <TabsContent value="branches">
          <Card className="p-6">
            <BranchManagement />
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <RecordsTab
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            isEditing={isEditing}
            depositDate={depositDate}
            setDepositDate={setDepositDate}
            depositOdooSession={depositOdooSession}
            setDepositOdooSession={setDepositOdooSession}
            depositStatus={depositStatus}
            setDepositStatus={setDepositStatus}
            depositNotes={depositNotes}
            setDepositNotes={setDepositNotes}
            handoverDate={handoverDate}
            setHandoverDate={setHandoverDate}
            handoverOdooSession={handoverOdooSession}
            setHandoverOdooSession={setHandoverOdooSession}
            handoverStatus={handoverStatus}
            setHandoverStatus={setHandoverStatus}
            handoverNotes={handoverNotes}
            setHandoverNotes={setHandoverNotes}
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            invoiceStatus={invoiceStatus}
            setInvoiceStatus={setInvoiceStatus}
            processedRecords={processedRecords}
            onEdit={handleEdit}
            onSubmit={handleSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};