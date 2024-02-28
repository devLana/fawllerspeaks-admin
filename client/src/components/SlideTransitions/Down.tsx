import * as React from "react";
import Slide, { type SlideProps } from "@mui/material/Slide";

type TransitionProps = Omit<SlideProps, "direction">;

const Down = React.forwardRef(function SlideDown(props: TransitionProps, ref) {
  return <Slide {...props} ref={ref} direction="down" />;
});

export default Down;
