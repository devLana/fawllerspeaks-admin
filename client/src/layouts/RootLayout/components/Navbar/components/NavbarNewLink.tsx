import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import NextLink from "@components/NextLink";
import type { MuiIconType } from "@types";
import transition from "../utils/transition";

interface NavbarNewLinkProps {
  label: string;
  href: string;
  Icon: MuiIconType;
  isOpen: boolean;
}

const NavbarNewLink = (props: NavbarNewLinkProps) => {
  const { label, href, Icon, isOpen } = props;

  return (
    <Tooltip title={isOpen ? null : label} placement="right">
      <ListItem sx={{ py: 1, px: 3, pl: { sm: 0 } }}>
        <ListItemButton
          sx={theme => ({
            px: 1.5,
            borderRadius: 1,
            border: 1,
            borderColor: "primary.main",
            color: "primary.main",
            boxShadow: 3,
            "&:hover": { color: "primary.main", bgcolor: "inherit" },
            [theme.breakpoints.up("sm")]: {
              flexGrow: 0,
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
              },
            })}
          />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};

export default NavbarNewLink;
