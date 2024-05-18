import { useRouter } from "next/router";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import NextLink from "@components/NextLink";
import transition from "../utils/transition";
import type { NavbarLinkItem } from "@types";

interface NavbarItemLinkProps extends NavbarLinkItem {
  isOpen: boolean;
  showTooltip: boolean;
  onClick: VoidFunction | undefined;
}

const NavbarItemLink = ({
  isPrimary,
  href,
  label,
  Icon,
  hasDivider,
  isOpen,
  showTooltip,
  onClick,
}: NavbarItemLinkProps) => {
  const { pathname } = useRouter();

  return (
    <ListItem
      sx={{
        py: 2,
        px: 0,
        ...(hasDivider ? { borderBottom: 1, borderColor: "divider" } : {}),
      }}
    >
      <Tooltip title={showTooltip ? label : null} placement="right">
        <ListItemButton
          sx={{
            px: 1.5,
            borderRadius: 1,
            border: 1,
            borderColor: isPrimary ? "primary.main" : "transparent",
            color: "primary.main",
            whiteSpace: { sm: "nowrap" },
            overflow: { sm: "hidden" },
            transition: ({ transitions: transit }) => {
              return transition(transit, isOpen, ["background-color"]);
            },
            "&:hover": { color: "primary.main" },
            "&[aria-current=page]": {
              bgcolor: "primary.main",
              color: "background.default",
              boxShadow: 3,
            },
          }}
          component={NextLink}
          href={href}
          onClick={onClick}
          aria-current={pathname === href ? "page" : undefined}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 0 }}>
            <Icon />
          </ListItemIcon>
          <ListItemText
            primary={label}
            sx={{
              my: 0,
              marginLeft: 2,
              ml: { sm: isOpen ? 2 : 0, md: isOpen ? 0 : 2 },
              opacity: { sm: isOpen ? 1 : 0, md: isOpen ? 0 : 1 },
              transition: ({ transitions: transit }) => {
                return transition(transit, isOpen, ["margin-left", "opacity"]);
              },
              "&>.MuiTypography-root": { lineHeight: 1 },
            }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

export default NavbarItemLink;
