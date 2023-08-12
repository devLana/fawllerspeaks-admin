import React from "react";
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
}

const multiPageHrefs = ["/posts", "/settings"];

const NavbarItem = (props: NavbarItemProps) => {
  const { pathname } = useRouter();

  const { label, href, Icon, isOpen } = props;
  let isActive = false;

  if (href === pathname) {
    isActive = true;
  } else if (multiPageHrefs.includes(href) && pathname.startsWith(href)) {
    isActive = true;
  }

  return (
    <Tooltip title={isOpen ? null : label} placement="right">
      <ListItem sx={{ py: 1, pr: 0, pl: { xs: 3, sm: 0 } }}>
        <ListItemButton
          sx={theme => ({
            pl: 1.5,
            pr: 0,
            borderRadius: "1.5rem 0 0 1.5rem",
            bgcolor: isActive ? "primary.main" : "transparent",
            color: isActive ? "primary.dark" : "inherit",
            transition: transition(theme, isOpen, ["background-color"]),
            "&:hover": {
              bgcolor: isActive ? "primary.main" : "action.hover",
              color: isActive ? "primary.dark" : "inherit",
            },
            [theme.breakpoints.up("sm")]: {
              whiteSpace: "nowrap",
              overflow: "hidden",
            },
          })}
          component={NextLink}
          href={href}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 0 }}>
            <Icon />
          </ListItemIcon>
          <ListItemText
            primary={label}
            sx={theme => ({
              ml: 1,
              my: 0,
              transition: transition(theme, isOpen, ["margin-left", "opacity"]),
              "&>.MuiTypography-root": { lineHeight: 1 },
              [theme.breakpoints.up("sm")]: {
                ...(isOpen ? { ml: 1, opacity: 1 } : { ml: 0, opacity: 0 }),
                "&>.MuiTypography-root": {
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: isActive ? 0.5 : "normal",
                },
              },
            })}
          />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};

export default NavbarItem;
