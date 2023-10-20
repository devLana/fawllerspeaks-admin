import * as React from "react";

import Slide, { type SlideProps } from "@mui/material/Slide";

type TransitionProps = Omit<SlideProps, "direction">;

const Right = React.forwardRef(function SlideRight(
  props: TransitionProps,
  ref
) {
  return <Slide {...props} ref={ref} direction="right" />;
});

export default Right;
