import React from "react";
import { useRouter } from "next/router";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import NextLink from "@components/NextLink";
import transition from "@layouts/Layout/components/Navbar/utils/transition";
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
          pl: { xs: 3, sm: 0 },
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
            borderRadius: "1.5rem 0 0 1.5rem",
            bgcolor: isActive ? "primary.main" : "transparent",
            color: isActive ? "primary.dark" : "inherit",
            transition: transition(theme, isOpen, [
              "background-color",
              "padding",
            ]),
            "&:hover": {
              bgcolor: isActive ? "primary.main" : "text.disabled",
              color: isActive ? "primary.dark" : "inherit",
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
          <ListItemIcon sx={{ color: "inherit" }}>
            <Icon />
          </ListItemIcon>
          <ListItemText
            primary={label}
            sx={{
              m: 0,
              "& > .MuiTypography-root": {
                fontWeight: isActive ? 700 : 400,
                letterSpacing: isActive ? 0.5 : "normal",
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};

export default NavbarItem;
