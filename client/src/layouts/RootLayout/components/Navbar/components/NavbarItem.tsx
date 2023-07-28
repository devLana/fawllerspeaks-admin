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
  smMatches: boolean;
}

const NavbarItem = (props: NavbarItemProps) => {
  const { pathname } = useRouter();

  const { label, href, Icon, isOpen, smMatches } = props;
  const isActive = pathname === href;

  return (
    <Tooltip title={!isOpen && smMatches ? label : null} placement="right">
      <ListItem sx={{ py: 1, pr: 0, pl: { xs: 3, sm: 0 } }}>
        <ListItemButton
          sx={theme => ({
            borderRadius: "1.5rem 0 0 1.5rem",
            bgcolor: isActive ? "primary.main" : "transparent",
            color: isActive ? "primary.dark" : "inherit",
            transition: transition(theme, isOpen, [
              "background-color",
              "padding",
            ]),
            "&:hover": {
              bgcolor: isActive ? "primary.main" : "action.hover",
              color: isActive ? "primary.dark" : "inherit",
            },
            [theme.breakpoints.up("sm")]: {
              px: isOpen ? 2 : 1.5,
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
              ml: "0.5rem",
              [theme.breakpoints.up("sm")]: {
                ml: isOpen ? "0.5rem" : 0,
                overflowX: isOpen ? "visible" : "hidden",
              },
              "&>.MuiTypography-root": {
                fontWeight: isActive ? 700 : 400,
                letterSpacing: isActive ? 0.5 : "normal",
                lineHeight: isOpen ? 1 : 0,
                width: isOpen ? "auto" : 0,
              },
            })}
          />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};

export default NavbarItem;
