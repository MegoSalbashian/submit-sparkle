import React from "react";
import { Card } from "@/components/ui/card";
import { RecordForm } from "./RecordForm";
import { ProcessedRecords } from "../ProcessedRecords";

interface Record {
  id: string;
  branchName: string;
  date: string;
  depositOdooSession: string;
  handoverOdooSession: string;
  depositStatus: string;
  handoverStatus: string;
  invoiceStatus: string;
}

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
  processedRecords: Record[];
  onEdit: (record: Record) => void;
  onDelete: (recordId: string) => void;
  onSubmitDeposit: (e: React.FormEvent) => void;
  onSubmitHandover: (e: React.FormEvent) => void;
  onSubmitInvoice: (e: React.FormEvent) => void;
}

export const RecordsTab = ({
  selectedBranch,
  setSelectedBranch,
  isEditing,
  depositDate,
  setDepositDate,
  depositOdooSession,
  setDepositOdooSession,
  depositStatus,
  setDepositStatus,
  depositNotes,
  setDepositNotes,
  handoverDate,
  setHandoverDate,
  handoverOdooSession,
  setHandoverOdooSession,
  handoverStatus,
  setHandoverStatus,
  handoverNotes,
  setHandoverNotes,
  invoiceDate,
  setInvoiceDate,
  invoiceStatus,
  setInvoiceStatus,
  processedRecords,
  onEdit,
  onDelete,
  onSubmitDeposit,
  onSubmitHandover,
  onSubmitInvoice,
}: RecordsTabProps) => {
  return (
    <div className="space-y-8">
      <RecordForm
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        isEditing={isEditing}
        depositDate={depositDate}
        setDepositDate={setDepositDate}
        depositOdooSession={depositOdooSession}
        setDepositOdooSession={setDepositOdooSession}
        depositStatus={depositStatus}
        setDepositStatus={setDepositStatus}
        depositNotes={depositNotes}
        setDepositNotes={setDepositNotes}
        handoverDate={handoverDate}
        setHandoverDate={setHandoverDate}
        handoverOdooSession={handoverOdooSession}
        setHandoverOdooSession={setHandoverOdooSession}
        handoverStatus={handoverStatus}
        setHandoverStatus={setHandoverStatus}
        handoverNotes={handoverNotes}
        setHandoverNotes={setHandoverNotes}
        invoiceDate={invoiceDate}
        setInvoiceDate={setInvoiceDate}
        invoiceStatus={invoiceStatus}
        setInvoiceStatus={setInvoiceStatus}
        onSubmitDeposit={onSubmitDeposit}
        onSubmitHandover={onSubmitHandover}
        onSubmitInvoice={onSubmitInvoice}
      />

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