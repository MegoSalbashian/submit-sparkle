import React from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";
import { format, isValid } from "date-fns";

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
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    if (!isValid(date)) return "Invalid date";
    try {
      return format(date, "MMM d, yyyy HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600';
      case 'missing':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Processed Records</h2>
      <Accordion type="single" collapsible className="w-full">
        {records.map((record) => (
          <AccordionItem key={record.id} value={record.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <span>{record.branchName}</span>
                  <div className="flex items-center gap-4">
                    <span className={getStatusColor(record.depositStatus)}>
                      Deposit
                    </span>
                    <span className={getStatusColor(record.handoverStatus)}>
                      Handover
                    </span>
                    <span className={getStatusColor(record.invoiceStatus)}>
                      Invoice
                    </span>
                  </div>
                </div>
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
                    Status: <span className={getStatusColor(record.depositStatus)}>{record.depositStatus}</span>
                    <br />
                    Odoo Session: {record.depositOdooSession}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Last updated: {formatDate(record.deposit_updated_at)}
                    </span>
                  </div>
                  
                  <div className="text-sm font-medium">Handover</div>
                  <div className="text-sm">
                    Status: <span className={getStatusColor(record.handoverStatus)}>{record.handoverStatus}</span>
                    <br />
                    Odoo Session: {record.handoverOdooSession}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Last updated: {formatDate(record.handover_updated_at)}
                    </span>
                  </div>
                  
                  <div className="text-sm font-medium">Invoice</div>
                  <div className="text-sm">
                    Status: <span className={getStatusColor(record.invoiceStatus)}>{record.invoiceStatus}</span>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Last updated: {formatDate(record.invoice_updated_at)}
                    </span>
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