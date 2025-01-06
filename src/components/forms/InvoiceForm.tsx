import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceFormProps {
  invoiceDate: string;
  setInvoiceDate: (value: string) => void;
  invoiceStatus: string;
  setInvoiceStatus: (value: string) => void;
}

export const InvoiceForm = ({
  invoiceDate,
  setInvoiceDate,
  invoiceStatus,
  setInvoiceStatus,
}: InvoiceFormProps) => {
  return (
    <div className="border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Invoice</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="invoiceDate">Date</Label>
          <Input
            type="date"
            id="invoiceDate"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceStatus">Status</Label>
          <Select value={invoiceStatus} onValueChange={setInvoiceStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="missing">Missing invoices</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};