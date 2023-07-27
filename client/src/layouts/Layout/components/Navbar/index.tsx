import * as React from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";

import NavbarItem from "./components/NavbarItem";
import NavbarLogoutButton from "./components/NavbarLogoutButton";
import NavbarNewLink from "./components/NavbarNewLink";
import NavbarToggleButton from "./components/NavbarToggleButton";
import { topLinks, postLinks, otherLinks } from "./utils/navbarMenu";
import transition from "./utils/transition";

interface NavbarProps {
  onToggle: () => void;
  isOpen: boolean;
  setNavBarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ isOpen, onToggle, setNavBarIsOpen }: NavbarProps) => {
  const theme = useTheme();
  const smMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));

  React.useEffect(() => {
    if (mdMatches) {
      setNavBarIsOpen(true);
    } else {
      setNavBarIsOpen(false);
    }
  }, [mdMatches, setNavBarIsOpen]);

  return (
    <Drawer
      open={smMatches || isOpen}
      onClose={smMatches ? undefined : onToggle}
      variant={smMatches ? "permanent" : "temporary"}
      sx={{
        "& .MuiDrawer-paper": {
          [theme.breakpoints.up("sm")]: {
            width: isOpen ? "12rem" : "4.7rem",
            transition: transition(theme, isOpen, "width"),
            position: "static",
            overflowY: "inherit",
          },
        },
      }}
    >
      <NavbarToggleButton isOpen={isOpen} onClick={onToggle} />
      <Divider sx={{ mb: 2.5, mr: { sm: 3 } }} />
      <nav aria-label="Main">
        <List>
          {topLinks.map(({ primary, ...link }) => (
            <React.Fragment key={link.label}>
              {primary ? (
                <NavbarNewLink
                  {...link}
                  isOpen={isOpen}
                  smMatches={smMatches}
                />
              ) : (
                <NavbarItem {...link} isOpen={isOpen} smMatches={smMatches} />
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider sx={{ mr: { sm: 3 } }} />
        <List>
          {postLinks.map(link => (
            <NavbarItem
              key={link.label}
              {...link}
              isOpen={isOpen}
              smMatches={smMatches}
            />
          ))}
        </List>
        <Divider sx={{ mr: { sm: 3 } }} />
        <List>
          {otherLinks.map(({ Icon, label, ...link }) => (
            <React.Fragment key={label}>
              {link.type === "link" ? (
                <NavbarItem
                  label={label}
                  href={link.href}
                  Icon={Icon}
                  isOpen={isOpen}
                  smMatches={smMatches}
                />
              ) : (
                <NavbarLogoutButton
                  label={label}
                  Icon={Icon}
                  isOpen={isOpen}
                  smMatches={smMatches}
                />
              )}
            </React.Fragment>
          ))}
        </List>
      </nav>
    </Drawer>
  );
};

export default Navbar;
