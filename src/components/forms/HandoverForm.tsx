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

interface HandoverFormProps {
  handoverDate: string;
  setHandoverDate: (value: string) => void;
  handoverOdooSession: string;
  setHandoverOdooSession: (value: string) => void;
  handoverStatus: string;
  setHandoverStatus: (value: string) => void;
  handoverNotes: string;
  setHandoverNotes: (value: string) => void;
}

export const HandoverForm = ({
  handoverDate,
  setHandoverDate,
  handoverOdooSession,
  setHandoverOdooSession,
  handoverStatus,
  setHandoverStatus,
  handoverNotes,
  setHandoverNotes,
}: HandoverFormProps) => {
  return (
    <div className="border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Handover Form</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="handoverDate">Date</Label>
          <Input
            type="date"
            id="handoverDate"
            value={handoverDate}
            onChange={(e) => setHandoverDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="handoverOdooSession">Odoo Session Number</Label>
          <Input
            id="handoverOdooSession"
            placeholder="Enter Odoo session number"
            value={handoverOdooSession}
            onChange={(e) => setHandoverOdooSession(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="handoverStatus">Status</Label>
          <Select value={handoverStatus} onValueChange={setHandoverStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(handoverStatus === "pending" || handoverStatus === "missing") && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="handoverNotes">Notes</Label>
            <Textarea
              id="handoverNotes"
              placeholder="Enter reason for pending/missing status"
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};