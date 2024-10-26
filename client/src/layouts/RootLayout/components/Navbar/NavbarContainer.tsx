import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";

import transition from "@utils/layouts/transition";

interface NavbarContainerProps {
  isOpen: boolean;
  belowSm: boolean;
  children: React.ReactNode;
  minWidth: string;
  maxWidth: string;
  onClick: () => void;
}

const NavbarContainer = (props: NavbarContainerProps) => {
  const { children, isOpen, belowSm, minWidth, maxWidth, onClick } = props;

  return (
    <Box
      component="nav"
      aria-label="Main app"
      sx={({ breakpoints, transitions, zIndex }) => ({
        [breakpoints.down("sm")]: {
          position: "fixed",
          zIndex: zIndex.drawer,
          ...(isOpen && { inset: 0 }),
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
          position: "fixed",
          [theme.breakpoints.down("sm")]: {
            p: 3,
            transition: transition(theme.transitions, isOpen, "transform"),
            top: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "background.paper",
            zIndex: theme.zIndex.drawer,
            boxShadow: 16,
            borderTopRightRadius: `${theme.shape.borderRadius}px`,
            borderBottomRightRadius: `${theme.shape.borderRadius}px`,
            ...(theme.appTheme.themeMode !== "sunny" && {
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))",
            }),
            transform: isOpen ? "translateX(0)" : "translateX(-150%)",
          },
          [theme.breakpoints.up("sm")]: {
            borderRight: 1,
            borderColor: "divider",
            py: 2,
            top: theme.spacing(8),
            bottom: 0,
          },
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NavbarContainer;
