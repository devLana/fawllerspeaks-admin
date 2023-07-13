import Image from "next/image";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import NextLink from "@components/NextLink";
import HeaderAvatar from "./components/HeaderAvatar";
import HeaderThemeButton from "./components/HeaderThemeButton";
import transition from "../../utils/transition";

interface HeaderProps {
  isOpen: boolean;
  drawerWidth: string;
  smDrawerWidth: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Header = ({
  isOpen,
  drawerWidth,
  smDrawerWidth,
  onClick,
}: HeaderProps) => (
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
        aria-label="Show navbar"
        sx={{ mr: 1, display: { sm: "none" } }}
        onClick={onClick}
      >
        <MenuIcon />
      </IconButton>
      <Box sx={{ maxWidth: "10rem", width: "40%", mr: "auto" }}>
        <NextLink href="/" sx={{ display: "flex" }} aria-label="Dashboard">
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
        <HeaderThemeButton />
        <HeaderAvatar />
      </Stack>
    </Toolbar>
  </AppBar>
);

export default Header;
