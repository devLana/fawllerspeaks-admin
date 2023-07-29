import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import NextLink from "@components/NextLink";

const links = [
  {
    to: "/settings/change-password",
    Icon: VpnKeyOutlinedIcon,
    label: "Change your password",
  },
  {
    to: "/settings/me",
    Icon: PersonOutlineOutlinedIcon,
    label: "Profile",
  },
  {
    to: "/settings/personalization",
    Icon: TuneRoundedIcon,
    label: "Personalization",
  },
] as const;

const SettingsNavLinks = () => {
  const { pathname } = useRouter();

  const menuLinks = links.map(({ Icon, label, to }) => {
    const isActive = pathname === to;

    return (
      <MenuItem
        key={label}
        sx={{
          p: 0,
          minHeight: 0,
          bgcolor: isActive ? "action.hover" : "inherit",
        }}
      >
        <NextLink
          href={to}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            p: 2,
            color: isActive ? "text.primary" : "primary.main",
            "&:hover": { color: isActive ? "text.primary" : "primary.main" },
          }}
          aria-current={isActive || undefined}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{label}</ListItemText>
          <ChevronRightIcon sx={{ ml: 2, justifySelf: "flex-end" }} />
        </NextLink>
      </MenuItem>
    );
  });

  return (
    <Box component="nav" aria-label="Settings">
      <MenuList>{menuLinks}</MenuList>
    </Box>
  );
};

export default SettingsNavLinks;
