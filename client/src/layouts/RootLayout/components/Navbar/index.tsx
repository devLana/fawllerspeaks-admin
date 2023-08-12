import * as React from "react";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";

import NavbarContainer from "./components/NavbarContainer";
import NavbarItem from "./components/NavbarItem";
import NavbarLogoutButton from "./components/NavbarLogoutButton";
import NavbarNewLink from "./components/NavbarNewLink";
import NavbarToggleButton from "./components/NavbarToggleButton";
import { topLinks, postLinks, otherLinks } from "./utils/navbarMenu";

interface NavbarProps {
  onClick: () => void;
  isOpen: boolean;
}

const Navbar = ({ isOpen, onClick }: NavbarProps) => (
  <NavbarContainer isOpen={isOpen} onClick={onClick}>
    <NavbarToggleButton isOpen={isOpen} onClick={onClick} />
    <Divider sx={{ mb: 2.5, mr: { sm: 3 } }} />
    <List>
      {topLinks.map(({ primary, ...link }) => (
        <React.Fragment key={link.label}>
          {primary ? (
            <NavbarNewLink {...link} isOpen={isOpen} />
          ) : (
            <NavbarItem {...link} isOpen={isOpen} />
          )}
        </React.Fragment>
      ))}
    </List>
    <Divider sx={{ mr: { sm: 3 } }} />
    <List>
      {postLinks.map(link => (
        <NavbarItem key={link.label} {...link} isOpen={isOpen} />
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
            />
          ) : (
            <NavbarLogoutButton label={label} Icon={Icon} isOpen={isOpen} />
          )}
        </React.Fragment>
      ))}
    </List>
  </NavbarContainer>
);

export default Navbar;
