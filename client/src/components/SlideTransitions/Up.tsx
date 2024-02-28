import * as React from "react";
import Slide, { type SlideProps } from "@mui/material/Slide";

type TransitionProps = Omit<SlideProps, "direction">;

const Up = React.forwardRef(function SlideUp(props: TransitionProps, ref) {
  return <Slide {...props} ref={ref} direction="up" />;
});

export default Up;
