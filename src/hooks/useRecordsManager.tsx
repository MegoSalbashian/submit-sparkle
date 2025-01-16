import { useRecordsFetch } from "./records/useRecordsFetch";
import { useRecordsMutations } from "./records/useRecordsMutations";

interface ProcessedRecord {
  id: string;
  branchName: string;
  date: string;
  depositOdooSession: string;
  handoverOdooSession: string;
  depositStatus: string;
  handoverStatus: string;
  invoiceStatus: string;
}

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

  const processedRecords: ProcessedRecord[] = records.map(record => ({
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
    handleDelete,
    saveRecord,
    isLoading: isFetching || isMutating
  };
};