import React from "react";
import { format, isValid } from "date-fns";
import { RecordStatus } from "./RecordStatus";

interface RecordDetailsProps {
  depositStatus: string;
  handoverStatus: string;
  invoiceStatus: string;
  depositOdooSession: string;
  handoverOdooSession: string;
  deposit_updated_at?: string;
  handover_updated_at?: string;
  invoice_updated_at?: string;
}

export const RecordDetails = ({
  depositStatus,
  handoverStatus,
  invoiceStatus,
  depositOdooSession,
  handoverOdooSession,
  deposit_updated_at,
  handover_updated_at,
  invoice_updated_at,
}: RecordDetailsProps) => {
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

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-sm font-medium">Deposit Slip</div>
      <div className="text-sm">
        Status: <RecordStatus status={depositStatus} label="Deposit" />
        <br />
        Odoo Session: {depositOdooSession}
        <br />
        <span className="text-xs text-muted-foreground">
          Last updated: {formatDate(deposit_updated_at)}
        </span>
      </div>
      
      <div className="text-sm font-medium">Handover</div>
      <div className="text-sm">
        Status: <RecordStatus status={handoverStatus} label="Handover" />
        <br />
        Odoo Session: {handoverOdooSession}
        <br />
        <span className="text-xs text-muted-foreground">
          Last updated: {formatDate(handover_updated_at)}
        </span>
      </div>
      
      <div className="text-sm font-medium">Invoice</div>
      <div className="text-sm">
        Status: <RecordStatus status={invoiceStatus} label="Invoice" />
        <br />
        <span className="text-xs text-muted-foreground">
          Last updated: {formatDate(invoice_updated_at)}
        </span>
      </div>
    </div>
  );
};