import { FormState } from "@/types/admin";
import type { ToastProps } from "@/components/ui/toast";

type ToastFunction = (props: ToastProps) => void;

export const validateBranchSelection = (selectedBranch: string, toastFn: ToastFunction) => {
  if (!selectedBranch) {
    toastFn({
      title: "Error",
      description: "Please select a branch",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const createDepositData = (formState: FormState) => ({
  branch_id: formState.selectedBranch,
  date: formState.depositDate,
  deposit_status: formState.depositStatus.toLowerCase(),
  deposit_odoo_session: formState.depositOdooSession,
  deposit_notes: formState.depositNotes,
  deposit_updated_at: new Date().toISOString(),
});

export const createHandoverData = (formState: FormState) => ({
  branch_id: formState.selectedBranch,
  date: formState.handoverDate,
  handover_status: formState.handoverStatus.toLowerCase(),
  handover_odoo_session: formState.handoverOdooSession,
  handover_notes: formState.handoverNotes,
  handover_updated_at: new Date().toISOString(),
});

export const createInvoiceData = (formState: FormState) => ({
  branch_id: formState.selectedBranch,
  date: formState.invoiceDate,
  invoice_status: formState.invoiceStatus.toLowerCase(),
  invoice_updated_at: new Date().toISOString(),
});