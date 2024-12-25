import Image from "next/image";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import NextLink from "@components/ui/NextLink";
import UserAvatar from "@components/ui/UserAvatar";
import HeaderThemeButton from "./HeaderThemeButton";
import Skeleton from "@mui/material/Skeleton";

interface HeaderProps {
  onClick: () => void;
  isLoading: boolean;
}

const Header = ({ onClick, isLoading }: HeaderProps) => (
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
        aria-label="Show main app navigation"
        onClick={onClick}
        sx={{ mr: 2, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Box sx={{ maxWidth: "10rem", width: "40%", mr: "auto" }}>
        <NextLink href="/" sx={{ display: "flex" }}>
          <Image
            src="/logo.png"
            alt="FawllerSpeaks brand logo link to dashboard page"
            width={465}
            height={88}
            style={{ maxWidth: "100%", height: "auto" }}
            priority
          />
        </NextLink>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: { xs: 1, sm: 2 },
        }}
      >
        <HeaderThemeButton />
        <div aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <Skeleton
              variant="circular"
              aria-label="Loading user avatar"
              width={45}
              height={45}
            />
          ) : (
            <UserAvatar renderWithLink />
          )}
        </div>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
