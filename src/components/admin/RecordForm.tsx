import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/services/branchService";
import { Button } from "@/components/ui/button";
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
  onSubmitDeposit: (e: React.FormEvent) => void;
  onSubmitHandover: (e: React.FormEvent) => void;
  onSubmitInvoice: (e: React.FormEvent) => void;
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
  onSubmitDeposit,
  onSubmitHandover,
  onSubmitInvoice,
}: RecordFormProps) => {
  const { toast } = useToast();
  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  return (
    <Card className="p-6">
      <div className="space-y-8">
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

        <form onSubmit={onSubmitDeposit} className="space-y-6">
          <DepositSlipForm
            depositDate={depositDate}
            setDepositDate={setDepositDate}
            depositOdooSession={depositOdooSession}
            setDepositOdooSession={setDepositOdooSession}
            depositStatus={depositStatus.toLowerCase()}
            setDepositStatus={(value) => setDepositStatus(value.toLowerCase())}
            depositNotes={depositNotes}
            setDepositNotes={setDepositNotes}
          />
          <Button type="submit" className="w-full">
            Submit Deposit Record
          </Button>
        </form>

        <form onSubmit={onSubmitHandover} className="space-y-6">
          <HandoverForm
            handoverDate={handoverDate}
            setHandoverDate={setHandoverDate}
            handoverOdooSession={handoverOdooSession}
            setHandoverOdooSession={setHandoverOdooSession}
            handoverStatus={handoverStatus.toLowerCase()}
            setHandoverStatus={(value) => setHandoverStatus(value.toLowerCase())}
            handoverNotes={handoverNotes}
            setHandoverNotes={setHandoverNotes}
          />
          <Button type="submit" className="w-full">
            Submit Handover Record
          </Button>
        </form>

        <form onSubmit={onSubmitInvoice} className="space-y-6">
          <InvoiceForm
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            invoiceStatus={invoiceStatus.toLowerCase()}
            setInvoiceStatus={(value) => setInvoiceStatus(value.toLowerCase())}
          />
          <Button type="submit" className="w-full">
            Submit Invoice Record
          </Button>
        </form>
      </div>
    </Card>
  );
};