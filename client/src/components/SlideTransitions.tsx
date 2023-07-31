import Slide, { type SlideProps } from "@mui/material/Slide";

export type TransitionProps = Omit<SlideProps, "direction">;

export const DownTransition = (props: TransitionProps) => (
  <Slide {...props} direction="down" />
);

export const UpTransition = (props: TransitionProps) => (
  <Slide {...props} direction="up" />
);

export const LeftTransition = (props: TransitionProps) => (
  <Slide {...props} direction="left" />
);

export const RightTransition = (props: TransitionProps) => (
  <Slide {...props} direction="right" />
);
