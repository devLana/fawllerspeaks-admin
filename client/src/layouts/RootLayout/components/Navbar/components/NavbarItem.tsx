import { useRouter } from "next/router";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import NextLink from "@components/NextLink";
import transition from "../utils/transition";
import type { MuiIconType } from "@types";

interface NavbarItemProps {
  label: string;
  href: string;
  Icon: MuiIconType;
  isOpen: boolean;
  showTooltip: boolean;
  onClick: (() => void) | undefined;
}

const multiPageHrefs = ["/posts", "/settings"];

const NavbarItem = (props: NavbarItemProps) => {
  const { label, href, Icon, isOpen, showTooltip, onClick } = props;
  const { pathname } = useRouter();

  let isActive = false;

  if (href === pathname) {
    isActive = true;
  } else if (multiPageHrefs.includes(href) && pathname.startsWith(href)) {
    isActive = true;
  }

  return (
    <Tooltip title={showTooltip ? label : null} placement="right">
      <ListItem sx={{ py: 1, pr: 0, pl: { xs: 3, sm: 0 } }}>
        <ListItemButton
          sx={{
            pl: 1.5,
            pr: 0,
            borderRadius: "1.5rem 0 0 1.5rem",
            bgcolor: isActive ? "primary.main" : "transparent",
            color: isActive ? "background.default" : "inherit",
            whiteSpace: { sm: "nowrap" },
            overflow: { sm: "hidden" },
            transition: ({ transitions: transit }) => {
              return transition(transit, isOpen, ["background-color"]);
            },
            "&:hover": {
              bgcolor: isActive ? "primary.main" : "action.hover",
              color: isActive ? "background.default" : "inherit",
            },
          }}
          component={NextLink}
          href={href}
          onClick={onClick}
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
      </ListItem>
    </Tooltip>
  );
};

export default NavbarItem;
