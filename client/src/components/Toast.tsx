import Snackbar, {
  type SnackbarOrigin,
  type SnackbarProps,
} from "@mui/material/Snackbar";
import Alert, { type AlertColor, type AlertProps } from "@mui/material/Alert";
import Slide, { type SlideProps } from "@mui/material/Slide";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

type TransitionProps = Omit<SlideProps, "direction">;

interface ToastProps {
  horizontal?: SnackbarOrigin["horizontal"];
  vertical?: SnackbarOrigin["vertical"];
  isOpen: boolean;
  onClose: SnackbarProps["onClose"];
  direction?: SlideProps["direction"];
  severity: AlertColor;
  variant?: AlertProps["variant"];
  content: string;
}

const DownTransition = (props: TransitionProps) => (
  <Slide {...props} direction="down" />
);

const UpTransition = (props: TransitionProps) => (
  <Slide {...props} direction="up" />
);

const LeftTransition = (props: TransitionProps) => (
  <Slide {...props} direction="left" />
);

const RightTransition = (props: TransitionProps) => (
  <Slide {...props} direction="right" />
);

const Toast = ({
  horizontal = "right",
  vertical = "bottom",
  isOpen,
  onClose,
  direction = "left",
  severity,
  variant,
  content,
}: ToastProps) => {
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

  return (
    <Snackbar
      anchorOrigin={{ horizontal, vertical }}
      open={isOpen}
      onClose={onClose}
      autoHideDuration={2000}
      TransitionComponent={transition}
      key={transition.name}
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

export default Toast;
