import Box, { type BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import type { SxPropsArray } from "@types";
import type { PostActionStatus } from "types/posts";

interface CreatePostActionButtonsProps {
  status: PostActionStatus;
  nextLabel: string;
  actionLabel: string;
  sx?: BoxProps["sx"];
  hasPopUp?: boolean;
  onAction: VoidFunction;
  onNext?: VoidFunction;
}

const CreatePostActionButtons = ({
  onAction,
  onNext,
  status,
  nextLabel,
  actionLabel,
  hasPopUp = false,
  sx = [],
}: CreatePostActionButtonsProps) => {
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
        onClick={onAction}
      >
        <span>{actionLabel}</span>
      </LoadingButton>
      <Button
        variant="contained"
        disabled={status === "loading"}
        aria-haspopup={hasPopUp ? "dialog" : undefined}
        {...(onNext ? { onClick: onNext } : { type: "submit" })}
      >
        {nextLabel}
      </Button>
    </Box>
  );
};

export default CreatePostActionButtons;
