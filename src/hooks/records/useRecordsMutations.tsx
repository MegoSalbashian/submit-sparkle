import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RecordInput {
  branch_id: string;
  date: string;
  deposit_odoo_session?: string;
  handover_odoo_session?: string;
  deposit_status: string;
  handover_status: string;
  invoice_status: string;
  deposit_notes?: string;
  handover_notes?: string;
}

export const useRecordsMutations = () => {
  const queryClient = useQueryClient();

  const createRecord = async (record: RecordInput) => {
    console.log("Creating record:", record);
    
    // Ensure status fields are lowercase before saving
    const normalizedRecord = {
      ...record,
      deposit_status: record.deposit_status.toLowerCase(),
      handover_status: record.handover_status.toLowerCase(),
      invoice_status: record.invoice_status.toLowerCase()
    };

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
    
    // Ensure status fields are lowercase before saving
    const normalizedRecord = {
      ...record,
      deposit_status: record.deposit_status.toLowerCase(),
      handover_status: record.handover_status.toLowerCase(),
      invoice_status: record.invoice_status.toLowerCase()
    };

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