import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RecordStatus } from "./RecordStatus";
import { RecordDetails } from "./RecordDetails";

interface RecordItemProps {
  id: string;
  branchName: string;
  date: string;
  depositStatus: string;
  handoverStatus: string;
  invoiceStatus: string;
  depositOdooSession: string;
  handoverOdooSession: string;
  deposit_updated_at?: string;
  handover_updated_at?: string;
  invoice_updated_at?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const RecordItem = ({
  id,
  branchName,
  date,
  depositStatus,
  handoverStatus,
  invoiceStatus,
  depositOdooSession,
  handoverOdooSession,
  deposit_updated_at,
  handover_updated_at,
  invoice_updated_at,
  onEdit,
  onDelete,
}: RecordItemProps) => {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <span>{branchName}</span>
            <div className="flex items-center gap-4">
              <RecordStatus status={depositStatus} label="Deposit" />
              <RecordStatus status={handoverStatus} label="Handover" />
              <RecordStatus status={invoiceStatus} label="Invoice" />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {date}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <RecordDetails
            depositStatus={depositStatus}
            handoverStatus={handoverStatus}
            invoiceStatus={invoiceStatus}
            depositOdooSession={depositOdooSession}
            handoverOdooSession={handoverOdooSession}
            deposit_updated_at={deposit_updated_at}
            handover_updated_at={handover_updated_at}
            invoice_updated_at={invoice_updated_at}
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onEdit}
              className="flex-1"
            >
              Edit Record
            </Button>
            <Button 
              variant="destructive"
              size="icon"
              onClick={onDelete}
              title="Delete Record"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};