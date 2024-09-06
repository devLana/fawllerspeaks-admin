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
  const { to, label, Icon, onClick } = props;
  const { pathname } = useRouter();

  return (
    <MenuItem
      onClick={onClick}
      disableGutters
      sx={{ py: 0.125, "&:hover": { bgcolor: "transparent" } }}
    >
      <NextLink
        href={to}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          p: 2,
          color: "text.primary",
          "&:hover": { bgcolor: "action.hover", color: "text.primary" },
          "&[aria-current=page]": {
            color: "primary.main",
            bgcolor: "action.selected",
          },
          borderRadius: { md: 1 },
        }}
        aria-current={pathname.startsWith(to) ? "page" : undefined}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
        <ChevronRightIcon sx={{ ml: 1, justifySelf: "flex-end" }} />
      </NextLink>
    </MenuItem>
  );
};

export default SettingsMenuItem;
