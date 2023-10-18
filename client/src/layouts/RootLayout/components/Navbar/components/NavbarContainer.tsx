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

  return (
    <Box
      component="nav"
      aria-label="Main"
      sx={theme => ({
        [theme.breakpoints.down("sm")]: {
          width: 0,
          ...(isOpen && {
            width: "100%",
            position: "fixed",
            right: 0,
            bottom: 0,
            top: 0,
            left: 0,
            zIndex: theme.zIndex.drawer,
          }),
        },
        [theme.breakpoints.up("sm")]: {
          transition: transition(theme.transitions, isOpen, "width"),
          width: isOpen ? "calc(42px + 8em)" : "calc(50px + 1.5em)",
          borderRight: 1,
          borderColor: "divider",
        },
        [theme.breakpoints.up("md")]: {
          width: isOpen ? "calc(50px + 1.5em)" : "calc(42px + 8em)",
        },
      })}
    >
      {belowSm && (
        <Backdrop
          open={isOpen}
          onClick={onClick}
          sx={{ zIndex: -1, display: { sm: "none" } }}
        />
      )}
      <Box
        sx={theme => ({
          [theme.breakpoints.down("sm")]: {
            transition: transition(theme.transitions, isOpen, "transform"),
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "background.paper",
            zIndex: theme.zIndex.drawer,
            boxShadow: 16,
            ...(theme.appTheme.themeMode !== "sunny" && {
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))",
            }),
            transform: isOpen ? "translateX(0)" : "translateX(-150%)",
          },
          [theme.breakpoints.up("sm")]: { pt: 3 },
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NavbarContainer;
