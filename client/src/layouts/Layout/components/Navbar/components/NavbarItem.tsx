import React from "react";
import { useRouter } from "next/router";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import NextLink from "@components/NextLink";
import transition from "@layouts/Layout/utils/transition";
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
      <ListItem
        sx={{
          py: 1,
          pr: 0,
          pl: { xs: 3.2, sm: isOpen ? 3.2 : 1 },
          transition: theme => ({
            sm: transition(theme, isOpen, "padding-left"),
          }),
        }}
      >
        <ListItemButton
          sx={theme => ({
            py: 1,
            pl: 2,
            pr: 0,
            bgcolor: isActive ? "primary.light" : "transparent",
            color: isActive ? "primary.dark" : "secondary.dark",
            borderRadius: "1.5rem 0 0 1.5rem",
            transition: transition(theme, isOpen, [
              "background-color",
              "padding",
            ]),
            "&:hover": {
              bgcolor: isActive ? "primary.light" : "secondary.light",
              color: isActive ? "primary.dark" : "secondary.dark",
            },
            [theme.breakpoints.up("sm")]: {
              px: isOpen ? 2 : 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
            },
          })}
          component={NextLink}
          href={href}
        >
          <ListItemIcon
            sx={{
              color: isActive ? "primary.dark" : "secondary.dark",
              ml: { sm: isOpen ? 0 : 0.5 },
              transition: theme => ({
                sm: transition(theme, isOpen, "margin-left"),
              }),
            }}
          >
            <Icon />
          </ListItemIcon>
          <ListItemText primary={label} sx={{ lineHeight: 0, m: 0 }} />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};

export default NavbarItem;
