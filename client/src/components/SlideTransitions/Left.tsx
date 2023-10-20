import * as React from "react";

import Slide, { type SlideProps } from "@mui/material/Slide";

type TransitionProps = Omit<SlideProps, "direction">;

const Left = React.forwardRef(function SlideLeft(props: TransitionProps, ref) {
  return <Slide {...props} ref={ref} direction="left" />;
});

export default Left;
