import type { DialogProps } from "@mui/material/Dialog";

export interface DialogOptions {
  title?: string;
  ariaDescribedBy?: DialogProps["aria-describedby"];
  content: React.ReactNode;
  contentDividers?: true;
  cancelText?: string;
  confirmText?: string;
  showConfirmAsError?: true;
  role?: DialogProps["role"];
  onConfirm: (callback: () => void) => Promise<void> | void;
}
