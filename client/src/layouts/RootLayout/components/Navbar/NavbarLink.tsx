import { useRouter } from "next/router";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import NextLink from "@components/ui/NextLink";
import transition from "@utils/layouts/transition";
import type { NavbarLinkItem } from "types/layouts/navbar";

interface NavbarLinkProps extends NavbarLinkItem {
  isOpen: boolean;
  showTooltip: boolean;
  onClick: VoidFunction | undefined;
}

const NavbarLink = ({
  isPrimary,
  href,
  label,
  Icon,
  isOpen,
  showTooltip,
  onClick,
}: NavbarLinkProps) => {
  const { pathname } = useRouter();
  let isCurrent: boolean;

  switch (href) {
    case "/":
      isCurrent = pathname === href;
      break;

    case "/posts":
      isCurrent = pathname.startsWith(href) && pathname !== "/posts/new";
      break;

    default:
      isCurrent = pathname.startsWith(href);
  }

  return (
    <ListItem
      disablePadding
      sx={{ ...(label === "Settings" && { mt: "auto", pt: 4 }) }}
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
            transition({ transitions: transit }) {
              return transition(transit, isOpen, ["background-color"]);
            },
            "&:hover": { color: "primary.main" },
            "&[aria-current=page]": { bgcolor: "action.selected" },
          }}
          component={NextLink}
          href={href}
          onClick={onClick}
          aria-current={isCurrent ? "page" : undefined}
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
              transition({ transitions: transit }) {
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

export default NavbarLink;
