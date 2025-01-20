import React from "react";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BranchManagement } from "./BranchManagement";
import { RecordsTab } from "./admin/RecordsTab";
import { useAdminFormState } from "@/hooks/useAdminFormState";
import { useRecordsManager } from "@/hooks/useRecordsManager";
import { useToast } from "@/hooks/use-toast";

export const AdminPanel = () => {
  const { formState, setters, resetForm, populateForm } = useAdminFormState();
  const { processedRecords, handleDelete, saveRecord, updateRecord } = useRecordsManager();
  const { toast } = useToast();

  const validateBranchSelection = () => {
    if (!formState.selectedBranch) {
      toast({
        title: "Error",
        description: "Please select a branch",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBranchSelection()) return;

    const depositData = {
      deposit_status: formState.depositStatus.toLowerCase(),
      deposit_odoo_session: formState.depositOdooSession,
      deposit_notes: formState.depositNotes,
      deposit_updated_at: new Date().toISOString(),
    };

    if (formState.isEditing && formState.editingId) {
      updateRecord({
        id: formState.editingId,
        ...depositData
      });
    } else {
      saveRecord({
        ...depositData,
        branch_id: formState.selectedBranch,
        date: formState.depositDate,
      });
    }
  };

  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBranchSelection()) return;

    const handoverData = {
      handover_status: formState.handoverStatus.toLowerCase(),
      handover_odoo_session: formState.handoverOdooSession,
      handover_notes: formState.handoverNotes,
      handover_updated_at: new Date().toISOString(),
    };

    if (formState.isEditing && formState.editingId) {
      updateRecord({
        id: formState.editingId,
        ...handoverData
      });
    } else {
      saveRecord({
        ...handoverData,
        branch_id: formState.selectedBranch,
        date: formState.handoverDate,
      });
    }
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBranchSelection()) return;

    const invoiceData = {
      invoice_status: formState.invoiceStatus.toLowerCase(),
      invoice_updated_at: new Date().toISOString(),
    };

    if (formState.isEditing && formState.editingId) {
      updateRecord({
        id: formState.editingId,
        ...invoiceData
      });
    } else {
      saveRecord({
        ...invoiceData,
        branch_id: formState.selectedBranch,
        date: formState.invoiceDate,
      });
    }
  };

  const handleEdit = (record: any) => {
    populateForm(record);
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
            {...formState}
            {...setters}
            processedRecords={processedRecords}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSubmitDeposit={handleSubmitDeposit}
            onSubmitHandover={handleSubmitHandover}
            onSubmitInvoice={handleSubmitInvoice}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};