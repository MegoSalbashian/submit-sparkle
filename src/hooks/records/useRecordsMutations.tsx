import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RecordInput {
  selectedBranch?: string;
  depositStatus?: string;
  depositDate?: string;
  depositOdooSession?: string;
  depositNotes?: string;
  handoverStatus?: string;
  handoverDate?: string;
  handoverOdooSession?: string;
  handoverNotes?: string;
  invoiceStatus?: string;
  invoiceDate?: string;
}

export const useRecordsMutations = () => {
  const queryClient = useQueryClient();

  const createRecord = async (record: RecordInput) => {
    console.log("Creating record:", record);
    
    // Map the form fields to database fields
    const normalizedRecord = {
      branch_id: record.selectedBranch,
      date: record.depositDate, // Using deposit date as the main date
      deposit_odoo_session: record.depositOdooSession,
      handover_odoo_session: record.handoverOdooSession,
      deposit_status: record.depositStatus?.toLowerCase(),
      handover_status: record.handoverStatus?.toLowerCase(),
      invoice_status: record.invoiceStatus?.toLowerCase(),
      deposit_notes: record.depositNotes,
      handover_notes: record.handoverNotes,
    };

    console.log("Normalized record for creation:", normalizedRecord);

    const { data, error } = await supabase
      .from("records")
      .insert(normalizedRecord)
      .select()
      .single();

    if (error) {
      console.error("Error creating record:", error);
      throw error;
    }

    return data;
  };

  const updateRecord = async ({ id, ...record }: RecordInput & { id: string }) => {
    console.log("Updating record:", { id, ...record });
    
    // Map the form fields to database fields
    const normalizedRecord = {
      branch_id: record.selectedBranch,
      date: record.depositDate,
      deposit_odoo_session: record.depositOdooSession,
      handover_odoo_session: record.handoverOdooSession,
      deposit_status: record.depositStatus?.toLowerCase(),
      handover_status: record.handoverStatus?.toLowerCase(),
      invoice_status: record.invoiceStatus?.toLowerCase(),
      deposit_notes: record.depositNotes,
      handover_notes: record.handoverNotes,
    };

    console.log("Normalized record for update:", normalizedRecord);

    const { data, error } = await supabase
      .from("records")
      .update(normalizedRecord)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating record:", error);
      throw error;
    }

    return data;
  };

  const deleteRecord = async (id: string) => {
    console.log("Deleting record:", id);
    const { error } = await supabase
      .from("records")
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting record:", error);
      throw error;
    }
  };

  const createMutation = useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success("Record created successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to create record");
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success("Record updated successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to update record");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success("Record deleted successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to delete record");
    }
  });

  return {
    createRecord: createMutation.mutate,
    updateRecord: updateMutation.mutate,
    deleteRecord: deleteMutation.mutate,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};