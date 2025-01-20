import React from "react";
import {
  Accordion,
} from "@/components/ui/accordion";
import { parseISO } from "date-fns";
import { RecordItem } from "./records/RecordItem";

interface ProcessedRecord {
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

interface ProcessedRecordsProps {
  records: ProcessedRecord[];
  onEdit: (record: ProcessedRecord) => void;
  onDelete: (recordId: string) => void;
}

export const ProcessedRecords = ({ records, onEdit, onDelete }: ProcessedRecordsProps) => {
  // Sort records by date in descending order
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Processed Records</h2>
      <Accordion type="single" collapsible className="w-full">
        {sortedRecords.map((record) => (
          <RecordItem
            key={record.id}
            {...record}
            onEdit={() => onEdit(record)}
            onDelete={() => onDelete(record.id)}
          />
        ))}
      </Accordion>
    </div>
  );
};