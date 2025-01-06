import React, { useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DepositSlipForm } from "./forms/DepositSlipForm";
import { HandoverForm } from "./forms/HandoverForm";
import { InvoiceForm } from "./forms/InvoiceForm";

// Mock data for processed records
const processedRecords = [
  {
    id: "1",
    branchName: "Main Branch",
    date: "2024-03-20",
    depositOdooSession: "DS001",
    handoverOdooSession: "HO001",
    depositStatus: "Approved",
    handoverStatus: "Approved",
    invoiceStatus: "Approved",
  },
  {
    id: "2",
    branchName: "Downtown",
    date: "2024-03-19",
    depositOdooSession: "DS002",
    handoverOdooSession: "HO002",
    depositStatus: "Pending",
    handoverStatus: "Approved",
    invoiceStatus: "Missing invoices",
  },
];

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
  
  // Invoice State
  const [invoiceStatus, setInvoiceStatus] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBranch) {
      toast({
        title: "Error",
        description: "Please select a branch.",
        variant: "destructive",
      });
      return;
    }

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
      
      <div className="space-y-8">
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
              Save Records
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Processed Records</h2>
          <Accordion type="single" collapsible className="w-full">
            {processedRecords.map((record) => (
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
                  <div className="space-y-2">
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </div>
  );
};