import Snackbar, {
  type SnackbarOrigin,
  type SnackbarCloseReason,
} from "@mui/material/Snackbar";
import Alert, { type AlertColor, type AlertProps } from "@mui/material/Alert";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { type SlideProps } from "@mui/material/Slide";

import {
  DownTransition,
  LeftTransition,
  RightTransition,
  UpTransition,
  type TransitionProps,
} from "./SlideTransitions";

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
      transition = DownTransition;
      break;
    case "up":
      transition = UpTransition;
      break;
    case "left":
    default:
      transition = LeftTransition;
      break;
    case "right":
      transition = RightTransition;
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
