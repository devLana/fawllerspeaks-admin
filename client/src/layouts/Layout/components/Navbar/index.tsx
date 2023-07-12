import Image from "next/image";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import NextLink from "@components/NextLink";
import NavbarAvatar from "./components/NavbarAvatar";
import NavbarThemeButton from "./components/NavbarThemeButton";
import transition from "../../utils/transition";

interface NavbarProps {
  isOpen: boolean;
  drawerWidth: string;
  smDrawerWidth: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Navbar = ({
  isOpen,
  drawerWidth,
  smDrawerWidth,
  onClick,
}: NavbarProps) => (
  <AppBar
    sx={theme => ({
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${isOpen ? drawerWidth : smDrawerWidth})`,
        ml: isOpen ? drawerWidth : smDrawerWidth,
        transition: transition(theme, isOpen, ["width", "margin-left"]),
      },
    })}
  >
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="Show sidebar"
        sx={{ mr: 1, display: { sm: "none" } }}
        onClick={onClick}
      >
        <MenuIcon />
      </IconButton>
      <Box sx={{ maxWidth: "10rem", width: "40%", mr: "auto" }}>
        <NextLink
          href="/"
          sx={{ display: "flex" }}
          aria-label="Click to go to the dashboard"
        >
          <Image
            src="/logo.png"
            alt="FawllerSpeaks logo"
            width={465}
            height={88}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </NextLink>
      </Box>
      <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
        <NavbarThemeButton />
        <NavbarAvatar />
      </Stack>
    </Toolbar>
  </AppBar>
);

export default Navbar;
