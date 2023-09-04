import { useRouter } from "next/router";

import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NextLink from "@components/NextLink";
import type { MuiIconType } from "@types";

interface SettingsMenuItemProps {
  to: string;
  label: string;
  Icon: MuiIconType;
  onClick?: () => void;
}

const SettingsMenuItem = (props: SettingsMenuItemProps) => {
  const { pathname } = useRouter();

  const { to, label, Icon, onClick } = props;
  let isActive = false;

  if (to === pathname) {
    isActive = true;
  } else if (pathname === "/settings/me/edit" && to === "/settings/me") {
    isActive = true;
  }

  return (
    <MenuItem
      onClick={onClick}
      disableGutters
      sx={{
        py: 0,
        minHeight: 0,
        bgcolor: isActive ? "action.hover" : "inherit",
      }}
    >
      <NextLink
        href={to}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          p: 2,
          color: isActive ? "text.primary" : "primary.main",
          "&:hover": { color: isActive ? "text.primary" : "primary.main" },
        }}
        aria-current={
          pathname === "/settings/me/edit" ? undefined : isActive || undefined
        }
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
        {/* <ListItemText sx={{ whiteSpace: "normal" }}>{label}</ListItemText> */}
        <ChevronRightIcon sx={{ ml: 2, justifySelf: "flex-end" }} />
      </NextLink>
    </MenuItem>
  );
};

export default SettingsMenuItem;
