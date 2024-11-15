import * as React from "react";
import { styled } from "@mui/material/styles";

const StyledFileInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  width: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  right: 0,
  whiteSpace: "nowrap",
  opacity: 0,
});

type FileInputProps = Omit<
  React.CustomComponentPropsWithRef<typeof StyledFileInput>,
  "type"
>;

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  function FileInputBase(props, ref) {
    return <StyledFileInput ref={ref} type="file" {...props} />;
  }
);
