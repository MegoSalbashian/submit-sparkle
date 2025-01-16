import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRecordsFetch = (branchId?: string, date?: string) => {
  const fetchRecords = async () => {
    console.log("Fetching records with params:", { branchId, date });
    
    let query = supabase
      .from("records")
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

    console.log("Fetched records:", data);
    return data;
  };

  return useQuery({
    queryKey: ['records', branchId, date],
    queryFn: fetchRecords,
    onError: (error) => {
      console.error("Query error:", error);
      toast.error("Failed to fetch records");
    }
  });
};