import Box from "@mui/material/Box";
import Button, { type ButtonProps } from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import type { Status } from "@types";

interface ActionButtonsProps {
  status: Status;
  label: string;
  onDraft: VoidFunction;
  onNext?: VoidFunction;
}

const ActionButtons = (props: ActionButtonsProps) => {
  const { onDraft, onNext, status, label } = props;

  const buttonProps: ButtonProps = {
    variant: "contained",
    disabled: status === "loading",
    ...(onNext ? { onClick: onNext } : { type: "submit" }),
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexWrap="wrap"
      rowGap={1.5}
      columnGap={2}
    >
      <LoadingButton
        variant="outlined"
        loading={status === "loading"}
        onClick={onDraft}
      >
        <span>Save as draft</span>
      </LoadingButton>
      <Button {...buttonProps}>{label}</Button>
    </Box>
  );
};

export default ActionButtons;
