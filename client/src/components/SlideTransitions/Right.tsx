import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@appTypes";

const Right = (props: TransitionProps) => (
  <Slide {...props} direction="right" />
);

export default Right;
