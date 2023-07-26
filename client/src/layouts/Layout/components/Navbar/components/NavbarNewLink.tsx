import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import NextLink from "@components/NextLink";
import type { MuiIconType } from "@types";
import transition from "@layouts/Layout/components/Navbar/utils/transition";

interface NavbarNewLinkProps {
  label: string;
  href: string;
  Icon: MuiIconType;
  isOpen: boolean;
  smMatches: boolean;
}

const NavbarNewLink = (props: NavbarNewLinkProps) => {
  const { label, href, Icon, isOpen, smMatches } = props;

  return (
    <Tooltip title={!isOpen && smMatches ? label : null} placement="right">
      <ListItem
        sx={{
          py: 1,
          px: 3,
          pl: { sm: 0 },
          transition: theme => ({ sm: transition(theme, isOpen, "padding") }),
        }}
      >
        <ListItemButton
          sx={theme => ({
            borderRadius: 1,
            border: 1,
            borderColor: "primary.main",
            color: "primary.main",
            boxShadow: 3,
            transition: transition(theme, isOpen, ["padding"]),
            "&:hover": { color: "primary.main", bgcolor: "inherit" },
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
          <ListItemText primary={label} sx={{ lineHeight: 0, m: 0 }} />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};

export default NavbarNewLink;
