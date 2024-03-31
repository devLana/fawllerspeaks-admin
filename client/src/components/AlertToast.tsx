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
  isOpen: boolean;
  onClose: () => void;
  severity: AlertColor;
  variant?: AlertProps["variant"];
  content: string;
  transition: React.FC<TransitionProps>;
}

const AlertToast = ({
  horizontal = "right",
  vertical = "bottom",
  isOpen,
  onClose,
  transition,
  severity,
  variant,
  content,
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
        severity={severity}
        variant={variant}
        icon={<CancelOutlinedIcon />}
        sx={{ width: "100%" }}
      >
        {content}
      </Alert>
    </Snackbar>
  );
};

export default AlertToast;
