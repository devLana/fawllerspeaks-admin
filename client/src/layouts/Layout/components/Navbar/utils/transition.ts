import type { Theme } from "@mui/material/styles";

const transition = (
  theme: Theme,
  isOpen: boolean,
  props: string | string[]
) => {
  return theme.transitions.create(props, {
    easing: theme.transitions.easing.sharp,
    duration:
      theme.transitions.duration[isOpen ? "enteringScreen" : "leavingScreen"],
  });
};

export default transition;
