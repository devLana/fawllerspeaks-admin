import Snackbar, {
  type SnackbarOrigin,
  type SnackbarCloseReason as Reason,
} from "@mui/material/Snackbar";
import Alert, { type AlertColor, type AlertProps } from "@mui/material/Alert";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { type SlideProps } from "@mui/material/Slide";

type TransitionProps = Omit<SlideProps, "direction">;

interface AlertToastProps {
  horizontal?: SnackbarOrigin["horizontal"];
  vertical?: SnackbarOrigin["vertical"];
  variant?: AlertProps["variant"];
  isOpen: boolean;
  severity: AlertColor;
  content: string;
  transition: (props: TransitionProps) => React.ReactNode;
  onClose: () => void;
}

const AlertToast = ({
  horizontal = "right",
  vertical = "bottom",
  variant = "standard",
  isOpen,
  severity,
  content,
  transition,
  onClose,
}: AlertToastProps) => {
  const handleClose = (_: React.SyntheticEvent | Event, reason: Reason) => {
    if (reason === "clickaway") return;
    onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ horizontal, vertical }}
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={transition}
    >
      <Alert
        variant={variant}
        severity={severity}
        icon={<CancelOutlinedIcon />}
        sx={{ width: "100%" }}
      >
        {content}
      </Alert>
    </Snackbar>
  );
};

export default AlertToast;
