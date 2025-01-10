import React from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";

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

interface ProcessedRecordsProps {
  records: ProcessedRecord[];
  onEdit: (record: ProcessedRecord) => void;
  onDelete: (recordId: string) => void;
}

export const ProcessedRecords = ({ records, onEdit, onDelete }: ProcessedRecordsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Processed Records</h2>
      <Accordion type="single" collapsible className="w-full">
        {records.map((record) => (
          <AccordionItem key={record.id} value={record.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span>{record.branchName}</span>
                <span className="text-sm text-muted-foreground">
                  {record.date}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Deposit Slip</div>
                  <div className="text-sm">
                    Status: {record.depositStatus}
                    <br />
                    Odoo Session: {record.depositOdooSession}
                  </div>
                  
                  <div className="text-sm font-medium">Handover</div>
                  <div className="text-sm">
                    Status: {record.handoverStatus}
                    <br />
                    Odoo Session: {record.handoverOdooSession}
                  </div>
                  
                  <div className="text-sm font-medium">Invoice</div>
                  <div className="text-sm">
                    Status: {record.invoiceStatus}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => onEdit(record)}
                    className="flex-1"
                  >
                    Edit Record
                  </Button>
                  <Button 
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(record.id)}
                    title="Delete Record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};