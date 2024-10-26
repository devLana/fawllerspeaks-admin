import Box, { type BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import type { SxPropsArray } from "@types";
import type { CreateStatus } from "types/posts/createPost";

interface ActionButtonsProps {
  status: CreateStatus;
  label: string;
  onDraft: VoidFunction;
  onNext?: VoidFunction;
  sx?: BoxProps["sx"];
}

const ActionButtons = (props: ActionButtonsProps) => {
  const { onDraft, onNext, status, label, sx = [] } = props;
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <Box
      sx={[
        {
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          rowGap: 1.5,
          columnGap: 2,
        },
        ...sxProp,
      ]}
    >
      <LoadingButton
        variant="outlined"
        loading={status === "loading"}
        onClick={onDraft}
      >
        <span>Save as draft</span>
      </LoadingButton>
      <Button
        variant="contained"
        disabled={status === "loading"}
        {...(onNext ? { onClick: onNext } : { type: "submit" })}
      >
        {label}
      </Button>
    </Box>
  );
};

export default ActionButtons;
