import { useRecordsFetch } from "./records/useRecordsFetch";
import { useRecordsMutations } from "./records/useRecordsMutations";

export const useRecordsManager = (branchId?: string, date?: string) => {
  const { data: records = [], isLoading: isFetching } = useRecordsFetch(branchId, date);
  const { createRecord, updateRecord, deleteRecord, isLoading: isMutating } = useRecordsMutations();

  const handleDelete = async (id: string) => {
    await deleteRecord(id);
  };

  const saveRecord = async (formData: any, isEditing: boolean, editingId: string | null) => {
    if (isEditing && editingId) {
      await updateRecord({ id: editingId, ...formData });
    } else {
      await createRecord(formData);
    }
  };

  return {
    records,
    processedRecords: records,
    handleDelete,
    saveRecord,
    isLoading: isFetching || isMutating
  };
};