import { useRecordsFetch } from "./records/useRecordsFetch";
import { useRecordsMutations } from "./records/useRecordsMutations";

export const useRecordsManager = (branchId?: string, date?: string) => {
  const { data: records = [], isLoading: isFetching } = useRecordsFetch(branchId, date);
  const { createRecord, updateRecord, deleteRecord, isLoading: isMutating } = useRecordsMutations();

  return {
    records,
    createRecord,
    updateRecord,
    deleteRecord,
    isLoading: isFetching || isMutating
  };
};