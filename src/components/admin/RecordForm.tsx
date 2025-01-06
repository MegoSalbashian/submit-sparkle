import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { branches } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepositSlipForm } from "../forms/DepositSlipForm";
import { HandoverForm } from "../forms/HandoverForm";
import { InvoiceForm } from "../forms/InvoiceForm";

interface RecordFormProps {
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
  onSubmit: (e: React.FormEvent) => void;
}

export const RecordForm = ({
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
  onSubmit,
}: RecordFormProps) => {
  const { toast } = useToast();

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DepositSlipForm
          depositDate={depositDate}
          setDepositDate={setDepositDate}
          depositOdooSession={depositOdooSession}
          setDepositOdooSession={setDepositOdooSession}
          depositStatus={depositStatus}
          setDepositStatus={setDepositStatus}
          depositNotes={depositNotes}
          setDepositNotes={setDepositNotes}
        />

        <HandoverForm
          handoverDate={handoverDate}
          setHandoverDate={setHandoverDate}
          handoverOdooSession={handoverOdooSession}
          setHandoverOdooSession={setHandoverOdooSession}
          handoverStatus={handoverStatus}
          setHandoverStatus={setHandoverStatus}
          handoverNotes={handoverNotes}
          setHandoverNotes={setHandoverNotes}
        />

        <InvoiceForm
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
          invoiceStatus={invoiceStatus}
          setInvoiceStatus={setInvoiceStatus}
        />
        
        <Button type="submit" className="w-full md:w-auto">
          {isEditing ? "Update Record" : "Save Record"}
        </Button>
      </form>
    </Card>
  );
};