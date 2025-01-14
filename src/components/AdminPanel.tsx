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
  const { processedRecords, handleDelete, saveRecord } = useRecordsManager();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.selectedBranch) {
      toast({
        title: "Error",
        description: "Please select a branch",
        variant: "destructive",
      });
      return;
    }

    saveRecord(formState, formState.isEditing, formState.editingId);
    resetForm();
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
            onSubmit={handleSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};