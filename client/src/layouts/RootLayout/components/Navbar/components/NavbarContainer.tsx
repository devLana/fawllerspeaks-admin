import useMediaQuery from "@mui/material/useMediaQuery";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";

import transition from "../utils/transition";

interface NavbarContainerProps {
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const mq = (theme: Theme) => theme.breakpoints.down("sm");

const NavbarContainer = (props: NavbarContainerProps) => {
  const { children, isOpen, onClick } = props;

  const belowSm = useMediaQuery(mq);

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
          transition: transition(theme, isOpen, "width"),
          // width: isOpen ? 160 : 75,
          width: isOpen ? "10rem" : 75,
          borderRight: 1,
          borderColor: "divider",
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
            transition: transition(theme, isOpen, "transform"),
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "background.paper",
            zIndex: theme.zIndex.drawer,
            boxShadow: 16,
            ...(theme.appTheme !== "sunny" && {
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))",
            }),
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          },
          [theme.breakpoints.up("sm")]: {
            height: "100%",
            pt: 3,
          },
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NavbarContainer;
