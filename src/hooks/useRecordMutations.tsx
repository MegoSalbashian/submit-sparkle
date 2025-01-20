import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRecordMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (record: any) => {
      console.log("Creating record:", record);
      
      const { data: existingRecord } = await supabase
        .from("records")
        .select("*")
        .eq('branch_id', record.branch_id)
        .eq('date', record.date)
        .maybeSingle();

      if (existingRecord) {
        const { data, error } = await supabase
          .from("records")
          .update(record)
          .eq('id', existingRecord.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("records")
          .insert(record)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success("Record saved successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to save record");
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

      if (error) throw error;
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

      if (error) throw error;
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

  return {
    createRecord: createMutation.mutate,
    updateRecord: updateMutation.mutate,
    deleteRecord: deleteMutation.mutate,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};