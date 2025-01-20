import React from "react";
import { Card } from "@/components/ui/card";
import { RecordForm } from "./RecordForm";
import { ProcessedRecords } from "../ProcessedRecords";
import { ProcessedRecord } from "@/types/admin";

interface RecordsTabProps {
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  isEditing: boolean;
  depositDate: string;
  setDepositDate: (value: string) => void;
  depositOdooSession: string;
  setDepositOdooSession: (value: string) => void;
  depositStatus: string;
  setDepositStatus: (value: string) => void;
  depositNotes: string;
  setDepositNotes: (value: string) => void;
  handoverDate: string;
  setHandoverDate: (value: string) => void;
  handoverOdooSession: string;
  setHandoverOdooSession: (value: string) => void;
  handoverStatus: string;
  setHandoverStatus: (value: string) => void;
  handoverNotes: string;
  setHandoverNotes: (value: string) => void;
  invoiceDate: string;
  setInvoiceDate: (value: string) => void;
  invoiceStatus: string;
  setInvoiceStatus: (value: string) => void;
  processedRecords: ProcessedRecord[];
  onEdit: (record: ProcessedRecord) => void;
  onDelete: (recordId: string) => void;
  onSubmitDeposit: (e: React.FormEvent) => void;
  onSubmitHandover: (e: React.FormEvent) => void;
  onSubmitInvoice: (e: React.FormEvent) => void;
}

export const RecordsTab = (props: RecordsTabProps) => {
  const {
    processedRecords,
    onEdit,
    onDelete,
    ...formProps
  } = props;

  return (
    <div className="space-y-8">
      <RecordForm {...formProps} />
      <Card className="p-6">
        <ProcessedRecords 
          records={processedRecords} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </div>
  );
};