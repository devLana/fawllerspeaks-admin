import * as React from "react";

import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import List from "@mui/material/List";
import type { Theme } from "@mui/material/styles";

import NavbarContainer from "./components/NavbarContainer";
import NavbarItem from "./components/NavbarItem";
import NavbarLogoutButton from "./components/NavbarLogoutButton";
import NavbarNewLink from "./components/NavbarNewLink";
import NavbarToggleButton from "./components/NavbarToggleButton";
import { topLinks, postLinks, otherLinks } from "./utils/navbarMenu";

interface NavbarProps {
  isOpen: boolean;
  onToggleNav: () => void;
  onCloseNav: () => void;
}

const Navbar = ({ isOpen, onToggleNav, onCloseNav }: NavbarProps) => {
  const belowSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const onClickNavLink = belowSm ? onCloseNav : undefined;

  return (
    <NavbarContainer isOpen={isOpen} belowSm={belowSm} onClick={onCloseNav}>
      <NavbarToggleButton isOpen={isOpen} onClick={onToggleNav} />
      <Divider sx={{ mb: 2.5, mr: { sm: 3 } }} />
      <List>
        {topLinks.map(({ primary, ...link }) => {
          return primary ? (
            <NavbarNewLink
              key={link.label}
              {...link}
              isOpen={isOpen}
              onClick={onClickNavLink}
            />
          ) : (
            <NavbarItem
              key={link.label}
              {...link}
              isOpen={isOpen}
              onClick={onClickNavLink}
            />
          );
        })}
      </List>
      <Divider sx={{ mr: { sm: 3 } }} />
      <List>
        {postLinks.map(link => (
          <NavbarItem
            key={link.label}
            {...link}
            isOpen={isOpen}
            onClick={onClickNavLink}
          />
        ))}
      </List>
      <Divider sx={{ mr: { sm: 3 } }} />
      <List>
        {otherLinks.map(link => {
          return link.type === "link" ? (
            <NavbarItem
              key={link.label}
              {...link}
              isOpen={isOpen}
              onClick={onClickNavLink}
            />
          ) : (
            <NavbarLogoutButton key={link.label} {...link} isOpen={isOpen} />
          );
        })}
      </List>
    </NavbarContainer>
  );
};

export default Navbar;
