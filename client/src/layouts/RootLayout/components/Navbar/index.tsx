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
  const sm_Above = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const md_Above = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const onClickNavLink = belowSm ? onCloseNav : undefined;
  let showTooltip: boolean;

  if (md_Above) {
    showTooltip = isOpen;
  } else if (sm_Above) {
    showTooltip = !isOpen;
  } else {
    showTooltip = false;
  }

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
              showTooltip={showTooltip}
              onClick={onClickNavLink}
            />
          ) : (
            <NavbarItem
              key={link.label}
              {...link}
              isOpen={isOpen}
              showTooltip={showTooltip}
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
            showTooltip={showTooltip}
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
              showTooltip={showTooltip}
              onClick={onClickNavLink}
            />
          ) : (
            <NavbarLogoutButton
              key={link.label}
              {...link}
              isOpen={isOpen}
              showTooltip={showTooltip}
            />
          );
        })}
      </List>
    </NavbarContainer>
  );
};

export default Navbar;
