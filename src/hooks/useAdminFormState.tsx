import { useState } from "react";
import type { Branch } from "@/services/branchService";

export const useAdminFormState = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [depositStatus, setDepositStatus] = useState<string>("");
  const [depositDate, setDepositDate] = useState<string>("");
  const [depositOdooSession, setDepositOdooSession] = useState<string>("");
  const [depositNotes, setDepositNotes] = useState<string>("");
  
  const [handoverStatus, setHandoverStatus] = useState<string>("");
  const [handoverDate, setHandoverDate] = useState<string>("");
  const [handoverOdooSession, setHandoverOdooSession] = useState<string>("");
  const [handoverNotes, setHandoverNotes] = useState<string>("");
  
  const [invoiceStatus, setInvoiceStatus] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
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

  const populateForm = (record: any) => {
    setIsEditing(true);
    setEditingId(record.id);
    setSelectedBranch(record.branch_id);
    setDepositDate(record.date);
    setDepositOdooSession(record.depositOdooSession);
    setDepositStatus(record.depositStatus.toLowerCase());
    setHandoverDate(record.date);
    setHandoverOdooSession(record.handoverOdooSession);
    setHandoverStatus(record.handoverStatus.toLowerCase());
    setInvoiceDate(record.date);
    setInvoiceStatus(record.invoiceStatus.toLowerCase());
  };

  return {
    formState: {
      selectedBranch,
      isEditing,
      editingId,
      depositStatus,
      depositDate,
      depositOdooSession,
      depositNotes,
      handoverStatus,
      handoverDate,
      handoverOdooSession,
      handoverNotes,
      invoiceStatus,
      invoiceDate,
    },
    setters: {
      setSelectedBranch,
      setDepositStatus,
      setDepositDate,
      setDepositOdooSession,
      setDepositNotes,
      setHandoverStatus,
      setHandoverDate,
      setHandoverOdooSession,
      setHandoverNotes,
      setInvoiceStatus,
      setInvoiceDate,
    },
    resetForm,
    populateForm,
  };
};