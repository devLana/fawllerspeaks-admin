import Snackbar, {
  type SnackbarOrigin,
  type SnackbarCloseReason,
} from "@mui/material/Snackbar";
import Alert, { type AlertColor, type AlertProps } from "@mui/material/Alert";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { type SlideProps } from "@mui/material/Slide";

import Up from "./SlideTransitions/Up";
import Down from "./SlideTransitions/Down";
import Left from "./SlideTransitions/Left";
import Right from "./SlideTransitions/Right";

type TransitionProps = Omit<SlideProps, "direction">;

interface AlertToastProps {
  horizontal?: SnackbarOrigin["horizontal"];
  vertical?: SnackbarOrigin["vertical"];
  isOpen: boolean;
  onClose: () => void;
  direction?: SlideProps["direction"];
  severity: AlertColor;
  variant?: AlertProps["variant"];
  content: string;
}

const AlertToast = ({
  horizontal = "right",
  vertical = "bottom",
  isOpen,
  onClose,
  direction = "left",
  severity,
  variant,
  content,
}: AlertToastProps) => {
  let transition: React.FC<TransitionProps>;

  switch (direction) {
    case "down":
      transition = Down;
      break;
    case "up":
      transition = Up;
      break;
    case "left":
    default:
      transition = Left;
      break;
    case "right":
      transition = Right;
  }

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason
  ) => {
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
