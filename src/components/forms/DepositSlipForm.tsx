import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepositSlipFormProps {
  depositDate: string;
  setDepositDate: (value: string) => void;
  depositOdooSession: string;
  setDepositOdooSession: (value: string) => void;
  depositStatus: string;
  setDepositStatus: (value: string) => void;
  depositNotes: string;
  setDepositNotes: (value: string) => void;
}

export const DepositSlipForm = ({
  depositDate,
  setDepositDate,
  depositOdooSession,
  setDepositOdooSession,
  depositStatus,
  setDepositStatus,
  depositNotes,
  setDepositNotes,
}: DepositSlipFormProps) => {
  return (
    <div className="border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Deposit Slip</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="depositDate">Date</Label>
          <Input
            type="date"
            id="depositDate"
            value={depositDate}
            onChange={(e) => setDepositDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositOdooSession">Odoo Session Number</Label>
          <Input
            id="depositOdooSession"
            placeholder="Enter Odoo session number"
            value={depositOdooSession}
            onChange={(e) => setDepositOdooSession(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositStatus">Status</Label>
          <Select value={depositStatus} onValueChange={setDepositStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(depositStatus === "pending" || depositStatus === "rejected") && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="depositNotes">Notes</Label>
            <Textarea
              id="depositNotes"
              placeholder="Enter reason for pending/rejected status"
              value={depositNotes}
              onChange={(e) => setDepositNotes(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};