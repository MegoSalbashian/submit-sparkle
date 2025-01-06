import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { branches } from "@/data/mockData";

export const AdminPanel = () => {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  
  // Deposit Slip State
  const [depositStatus, setDepositStatus] = useState<string>("");
  const [depositDate, setDepositDate] = useState<string>("");
  const [depositOdooSession, setDepositOdooSession] = useState<string>("");
  const [depositNotes, setDepositNotes] = useState<string>("");
  
  // Handover Form State
  const [handoverStatus, setHandoverStatus] = useState<string>("");
  const [handoverDate, setHandoverDate] = useState<string>("");
  const [handoverOdooSession, setHandoverOdooSession] = useState<string>("");
  const [handoverNotes, setHandoverNotes] = useState<string>("");
  
  // Invoice State - Modified to remove Odoo session
  const [invoiceStatus, setInvoiceStatus] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedBranch) {
      toast({
        title: "Error",
        description: "Please select a branch.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would update a database
    toast({
      title: "Success",
      description: "Records have been saved successfully.",
    });

    // Reset form
    setSelectedBranch("");
    setDepositStatus("");
    setDepositDate("");
    setDepositOdooSession("");
    setDepositNotes("");
    setHandoverStatus("");
    setHandoverDate("");
    setHandoverOdooSession("");
    setHandoverNotes("");
    setInvoiceStatus("");
    setInvoiceDate("");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
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

          {/* Deposit Slip Section */}
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

          {/* Handover Form Section */}
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
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(handoverStatus === "pending" || handoverStatus === "rejected") && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="handoverNotes">Notes</Label>
                  <Textarea
                    id="handoverNotes"
                    placeholder="Enter reason for pending/rejected status"
                    value={handoverNotes}
                    onChange={(e) => setHandoverNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Invoice Section - Modified */}
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
          
          <Button type="submit" className="w-full md:w-auto">
            Save Records
          </Button>
        </form>
      </Card>
    </div>
  );
};