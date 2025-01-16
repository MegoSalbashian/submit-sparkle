import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/services/branchService";

const STORAGE_KEY = 'processedRecords';

export const useRecordsManager = () => {
  const [processedRecords, setProcessedRecords] = useState<any[]>([]);
  const { toast } = useToast();
  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  useEffect(() => {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    if (savedRecords) {
      setProcessedRecords(JSON.parse(savedRecords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(processedRecords));
  }, [processedRecords]);

  const handleDelete = (recordId: string) => {
    setProcessedRecords(prev => prev.filter(record => record.id !== recordId));
    toast({
      title: "Success",
      description: "Record deleted successfully",
    });
  };

  const saveRecord = (formData: any, isEditing: boolean, editingId: string | null) => {
    const selectedBranchData = branches.find(b => b.id === formData.selectedBranch);
    
    if (isEditing && editingId) {
      setProcessedRecords(prev => prev.map(record => {
        if (record.id === editingId) {
          return {
            ...record,
            branchName: selectedBranchData?.name || "",
            date: formData.depositDate,
            depositOdooSession: formData.depositOdooSession,
            handoverOdooSession: formData.handoverOdooSession,
            depositStatus: formData.depositStatus.charAt(0).toUpperCase() + formData.depositStatus.slice(1),
            handoverStatus: formData.handoverStatus.charAt(0).toUpperCase() + formData.handoverStatus.slice(1),
            invoiceStatus: formData.invoiceStatus.charAt(0).toUpperCase() + formData.invoiceStatus.slice(1),
          };
        }
        return record;
      }));
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    } else {
      const newRecord = {
        id: Date.now().toString(),
        branchName: selectedBranchData?.name || "",
        date: formData.depositDate,
        depositOdooSession: formData.depositOdooSession,
        handoverOdooSession: formData.handoverOdooSession,
        depositStatus: formData.depositStatus.charAt(0).toUpperCase() + formData.depositStatus.slice(1),
        handoverStatus: formData.handoverStatus.charAt(0).toUpperCase() + formData.handoverStatus.slice(1),
        invoiceStatus: formData.invoiceStatus.charAt(0).toUpperCase() + formData.invoiceStatus.slice(1),
      };
      
      setProcessedRecords(prev => [...prev, newRecord]);
      toast({
        title: "Success",
        description: "Record added successfully",
      });
    }
  };

  return {
    processedRecords,
    handleDelete,
    saveRecord,
  };
};