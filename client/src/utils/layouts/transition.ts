import type { Transitions } from "@mui/material/styles";

const transition = (
  transitions: Transitions,
  isOpen: boolean,
  props: string | string[]
) => {
  return transitions.create(props, {
    easing: transitions.easing.sharp,
    duration: transitions.duration[isOpen ? "enteringScreen" : "leavingScreen"],
  });
};

export default transition;
