import Tooltip, { type TooltipProps } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export const NavbarTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
  { shouldForwardProp: prop => prop !== "isOpen" }
)<{ isOpen: boolean }>(({ theme, isOpen }) => ({
  display: "none",
  [theme.breakpoints.up("sm")]: { display: isOpen ? "none" : "block" },
  [theme.breakpoints.up("md")]: { display: isOpen ? "block" : "none" },
}));
