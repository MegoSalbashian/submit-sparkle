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
import { useRecordMutations } from "@/hooks/useRecordMutations";
import { useToast } from "@/hooks/use-toast";
import { validateBranchSelection, createDepositData, createHandoverData, createInvoiceData } from "@/utils/formHandlers";

export const AdminPanel = () => {
  const { formState, setters, resetForm, populateForm } = useAdminFormState();
  const { createRecord, updateRecord, deleteRecord } = useRecordMutations();
  const { toast } = useToast();

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBranchSelection(formState.selectedBranch, toast)) return;

    const depositData = createDepositData(formState);
    
    if (formState.isEditing && formState.editingId) {
      updateRecord({
        id: formState.editingId,
        ...depositData
      });
    } else {
      createRecord(depositData);
    }
    resetForm();
  };

  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBranchSelection(formState.selectedBranch, toast)) return;

    const handoverData = createHandoverData(formState);

    if (formState.isEditing && formState.editingId) {
      updateRecord({
        id: formState.editingId,
        ...handoverData
      });
    } else {
      createRecord(handoverData);
    }
    resetForm();
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBranchSelection(formState.selectedBranch, toast)) return;

    const invoiceData = createInvoiceData(formState);

    if (formState.isEditing && formState.editingId) {
      updateRecord({
        id: formState.editingId,
        ...invoiceData
      });
    } else {
      createRecord(invoiceData);
    }
    resetForm();
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
            processedRecords={[]}
            onEdit={populateForm}
            onDelete={deleteRecord}
            onSubmitDeposit={handleSubmitDeposit}
            onSubmitHandover={handleSubmitHandover}
            onSubmitInvoice={handleSubmitInvoice}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};