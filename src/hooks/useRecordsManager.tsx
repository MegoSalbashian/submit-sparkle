import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRecordsManager = (branchId?: string, date?: string) => {
  const queryClient = useQueryClient();

  const { data: records = [], isLoading: isFetching } = useQuery({
    queryKey: ['records', branchId, date],
    queryFn: async () => {
      let query = supabase
        .from('records')
        .select(`
          *,
          branch:branches(id, name)
        `)
        .order('date', { ascending: false });

      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching records:", error);
        throw error;
      }

      return data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (record: any) => {
      console.log("Creating record:", record);
      const { data, error } = await supabase
        .from("records")
        .insert(record)
        .select()
        .single();

      if (error) {
        console.error("Error creating record:", error);
        throw error;
      }

      return data;
    },
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
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      console.log("Updating record:", { id, updates });
      const { data, error } = await supabase
        .from("records")
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating record:", error);
        throw error;
      }

      return data;
    },
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
    mutationFn: async (id: string) => {
      console.log("Deleting record:", id);
      const { error } = await supabase
        .from("records")
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting record:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success("Record deleted successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to delete record");
    }
  });

  const processedRecords = records.map(record => ({
    id: record.id,
    branchName: record.branch?.name || 'Unknown Branch',
    date: record.date,
    depositOdooSession: record.deposit_odoo_session || '',
    handoverOdooSession: record.handover_odoo_session || '',
    depositStatus: record.deposit_status,
    handoverStatus: record.handover_status,
    invoiceStatus: record.invoice_status
  }));

  return {
    records,
    processedRecords,
    saveRecord: createMutation.mutate,
    updateRecord: updateMutation.mutate,
    handleDelete: deleteMutation.mutate,
    isLoading: isFetching || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};