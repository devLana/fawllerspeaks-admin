import type { SnackbarProps } from "@mui/material/Snackbar";
import type { AlertProps } from "@mui/material/Alert";
import type { TransitionProps } from "@appTypes";

export interface ToastOptions {
  content: React.ReactElement | string | null;
  placement?: SnackbarProps["anchorOrigin"];
  autoHideDuration?: SnackbarProps["autoHideDuration"];
  key: React.Attributes["key"];
  transition?: (props: TransitionProps) => React.ReactNode;
  snackbarSx?: SnackbarProps["sx"];
  variant?: AlertProps["variant"];
  severity?: AlertProps["severity"];
  role?: "alert" | "status";
  alertTitle?: string;
  icon?: false;
  action?: AlertProps["action"];
  alertCanClose?: boolean;
  alertSx?: AlertProps["sx"];
}
