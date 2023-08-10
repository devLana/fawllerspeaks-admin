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
}

const SettingsMenuItem = ({ to, label, Icon }: SettingsMenuItemProps) => {
  const { pathname } = useRouter();
  const isActive = pathname === to;

  return (
    <MenuItem
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
        aria-current={isActive || undefined}
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
