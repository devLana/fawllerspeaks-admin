import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import NextLink from "@components/NextLink";
import { NavbarTooltip } from "./NavbarTooltip";
import transition from "../utils/transition";
import type { MuiIconType } from "@types";

interface NavbarNewLinkProps {
  label: string;
  href: string;
  Icon: MuiIconType;
  isOpen: boolean;
}

const NavbarNewLink = (props: NavbarNewLinkProps) => {
  const { label, href, Icon, isOpen } = props;

  return (
    <NavbarTooltip isOpen={isOpen} title={label} placement="right">
      <ListItem sx={{ py: 1, px: 3, pl: { sm: 0 } }}>
        <ListItemButton
          sx={{
            px: 1.5,
            borderRadius: 1,
            border: 1,
            borderColor: "primary.main",
            color: "primary.main",
            boxShadow: 3,
            flexGrow: { sm: 0 },
            whiteSpace: { sm: "nowrap" },
            overflow: { sm: "hidden" },
            "&:hover": { color: "primary.main", bgcolor: "inherit" },
          }}
          component={NextLink}
          href={href}
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
    </NavbarTooltip>
  );
};

export default NavbarNewLink;
