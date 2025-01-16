import { supabase } from "@/integrations/supabase/client";

export type Branch = {
  id: string;
  name: string;
};

export const getBranches = async (): Promise<Branch[]> => {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
  
  return data || [];
};

export const addBranch = async (name: string): Promise<Branch> => {
  const { data, error } = await supabase
    .from('branches')
    .insert([{ name }])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding branch:', error);
    throw error;
  }
  
  return data;
};

export const updateBranch = async (id: string, name: string): Promise<void> => {
  const { error } = await supabase
    .from('branches')
    .update({ name })
    .eq('id', id);
    
  if (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

export const deleteBranch = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('branches')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting branch:', error);
    throw error;
  }
};