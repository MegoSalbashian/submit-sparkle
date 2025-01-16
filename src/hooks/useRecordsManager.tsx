import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useRecordsManager = () => {
  const [processedRecords, setProcessedRecords] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('records')
        .select('*, branches(name)')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error);
        toast({
          title: "Error",
          description: "Failed to fetch records",
          variant: "destructive",
        });
        return;
      }

      const formattedRecords = data.map(record => ({
        id: record.id,
        branchName: record.branches.name,
        branch_id: record.branch_id,
        date: record.date,
        depositOdooSession: record.deposit_odoo_session,
        handoverOdooSession: record.handover_odoo_session,
        depositStatus: record.deposit_status,
        handoverStatus: record.handover_status,
        invoiceStatus: record.invoice_status,
        depositNotes: record.deposit_notes,
        handoverNotes: record.handover_notes,
      }));

      console.log('Fetched records:', formattedRecords);
      setProcessedRecords(formattedRecords);
    } catch (error) {
      console.error('Error in fetchRecords:', error);
      toast({
        title: "Error",
        description: "Failed to fetch records",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', recordId);

      if (error) {
        console.error('Error deleting record:', error);
        toast({
          title: "Error",
          description: "Failed to delete record",
          variant: "destructive",
        });
        return;
      }

      await fetchRecords();
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    }
  };

  const saveRecord = async (formData: any, isEditing: boolean, editingId: string | null) => {
    try {
      const recordData = {
        branch_id: formData.selectedBranch,
        date: formData.depositDate,
        deposit_odoo_session: formData.depositOdooSession,
        handover_odoo_session: formData.handoverOdooSession,
        deposit_status: formData.depositStatus,
        handover_status: formData.handoverStatus,
        invoice_status: formData.invoiceStatus,
        deposit_notes: formData.depositNotes,
        handover_notes: formData.handoverNotes,
      };

      console.log('Saving record with data:', recordData);

      if (isEditing && editingId) {
        const { error } = await supabase
          .from('records')
          .update(recordData)
          .eq('id', editingId);

        if (error) {
          console.error('Error updating record:', error);
          toast({
            title: "Error",
            description: "Failed to update record",
            variant: "destructive",
          });
          return;
        }
      } else {
        const { error } = await supabase
          .from('records')
          .insert([recordData]);

        if (error) {
          console.error('Error inserting record:', error);
          toast({
            title: "Error",
            description: "Failed to create record",
            variant: "destructive",
          });
          return;
        }
      }

      await fetchRecords();
      toast({
        title: "Success",
        description: isEditing ? "Record updated successfully" : "Record created successfully",
      });
    } catch (error) {
      console.error('Error in saveRecord:', error);
      toast({
        title: "Error",
        description: "Failed to save record",
        variant: "destructive",
      });
    }
  };

  // Fetch records when the hook is initialized
  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    processedRecords,
    handleDelete,
    saveRecord,
  };
};