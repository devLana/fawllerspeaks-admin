import Box, { type BoxProps } from "@mui/material/Box";
import Button, { type ButtonProps } from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import type { CreateStatus, SxPropsArray } from "@types";

interface ActionButtonsProps {
  status: CreateStatus;
  label: string;
  onDraft: VoidFunction;
  onNext?: VoidFunction;
  sx?: BoxProps["sx"];
}

const ActionButtons = (props: ActionButtonsProps) => {
  const { onDraft, onNext, status, label, sx = [] } = props;

  const buttonProps: ButtonProps = {
    variant: "contained",
    disabled: status === "loading",
    ...(onNext ? { onClick: onNext } : { type: "submit" }),
  };

  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexWrap="wrap"
      rowGap={1.5}
      columnGap={2}
      sx={[...sxProp]}
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
