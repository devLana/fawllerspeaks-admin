import Image from "next/image";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import NextLink from "@components/NextLink";
import UserAvatar from "@components/UserAvatar";
import HeaderThemeButton from "./components/HeaderThemeButton";

const Header = ({ onClick }: { onClick: () => void }) => (
  <AppBar
    sx={({ appTheme: { themeMode } }) => ({
      ...(themeMode === "sunny" && { backgroundColor: "background.default" }),
    })}
  >
    <Toolbar component={Container}>
      <IconButton
        size="large"
        edge="start"
        color="primary"
        aria-label="Show navbar"
        sx={{ mr: 2, display: { sm: "none" } }}
        onClick={onClick}
      >
        <MenuIcon />
      </IconButton>
      <Box maxWidth="10rem" width="40%" mr="auto">
        <NextLink href="/" aria-label="Dashboard page" display="flex">
          <Image
            src="/logo.png"
            alt="FawllerSpeaks brand logo"
            width={465}
            height={88}
            style={{ maxWidth: "100%", height: "auto" }}
            priority
          />
        </NextLink>
      </Box>
      <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
        <HeaderThemeButton />
        <UserAvatar renderWithLink />
      </Stack>
    </Toolbar>
  </AppBar>
);

export default Header;
