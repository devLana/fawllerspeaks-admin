import * as React from "react";
import { styled } from "@mui/material/styles";

const StyledFileInput = styled("input")({
  position: "absolute",
  height: "1px",
  width: "1px",
  overflow: "hidden",
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
