export interface FormState {
  selectedBranch: string;
  isEditing: boolean;
  editingId: string | null;
  depositStatus: string;
  depositDate: string;
  depositOdooSession: string;
  depositNotes: string;
  handoverStatus: string;
  handoverDate: string;
  handoverOdooSession: string;
  handoverNotes: string;
  invoiceStatus: string;
  invoiceDate: string;
}

export interface ProcessedRecord {
  id: string;
  branchName: string;
  date: string;
  depositOdooSession: string;
  handoverOdooSession: string;
  depositStatus: string;
  handoverStatus: string;
  invoiceStatus: string;
  deposit_updated_at?: string;
  handover_updated_at?: string;
  invoice_updated_at?: string;
}