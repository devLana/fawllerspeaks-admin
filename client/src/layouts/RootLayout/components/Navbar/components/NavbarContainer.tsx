import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";

import transition from "../utils/transition";

interface NavbarContainerProps {
  isOpen: boolean;
  belowSm: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const NavbarContainer = (props: NavbarContainerProps) => {
  const { children, isOpen, belowSm, onClick } = props;

  const minWidth = "calc(51px + 1.5em)";
  const maxWidth = "calc(67px + 6.85em)";

  return (
    <Box
      component="nav"
      aria-label="Main sidebar"
      sx={({ breakpoints, transitions, zIndex }) => ({
        [breakpoints.down("sm")]: {
          position: "fixed",
          zIndex: zIndex.drawer,
          ...(isOpen ? { inset: 0 } : {}),
        },
        [breakpoints.up("sm")]: {
          width: isOpen ? maxWidth : minWidth,
          flexShrink: 0,
          transition: transition(transitions, isOpen, "width"),
        },
        [breakpoints.up("md")]: { width: isOpen ? minWidth : maxWidth },
      })}
    >
      {belowSm && (
        <Backdrop
          open={isOpen}
          onClick={onClick}
          sx={{
            zIndex: -1,
            display: { sm: "none" },
            backdropFilter: "blur(3px)",
          }}
        />
      )}
      <Box
        sx={theme => ({
          overflowY: "auto",
          [theme.breakpoints.down("sm")]: {
            p: 3,
            transition: transition(theme.transitions, isOpen, "transform"),
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "background.paper",
            zIndex: theme.zIndex.drawer,
            boxShadow: 16,
            borderTopRightRadius: `${theme.shape.borderRadius}px`,
            borderBottomRightRadius: `${theme.shape.borderRadius}px`,
            ...(theme.appTheme.themeMode !== "sunny"
              ? {
                  backgroundImage:
                    "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))",
                }
              : {}),
            transform: isOpen ? "translateX(0)" : "translateX(-150%)",
          },
          [theme.breakpoints.up("sm")]: {
            borderRight: 1,
            borderColor: "divider",
            pt: 2,
            pr: 3,
            position: "fixed",
            top: theme.spacing(8),
            bottom: 0,
            width: isOpen ? maxWidth : minWidth,
            transition: transition(theme.transitions, isOpen, "width"),
          },
          [theme.breakpoints.up("md")]: { width: isOpen ? minWidth : maxWidth },
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NavbarContainer;
