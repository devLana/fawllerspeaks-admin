import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface ToastActionButtonsProps {
  proceedLabel: string;
  cancelLabel: string;
  onProceed: VoidFunction;
  onCancel: VoidFunction;
}

const ToastActionButtons = (props: ToastActionButtonsProps) => (
  <>
    <IconButton
      aria-label={props.proceedLabel}
      size="small"
      color="inherit"
      onClick={props.onProceed}
    >
      <CheckIcon />
    </IconButton>
    <IconButton
      aria-label={props.cancelLabel}
      size="small"
      color="inherit"
      onClick={props.onCancel}
    >
      <CloseIcon />
    </IconButton>
  </>
);

export default ToastActionButtons;
