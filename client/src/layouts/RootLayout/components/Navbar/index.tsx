import useMediaQuery from "@mui/material/useMediaQuery";
import List from "@mui/material/List";
import type { Theme } from "@mui/material/styles";

import NavbarContainer from "./NavbarContainer";
import NavbarLink from "./NavbarLink";
import NavbarLogoutButton from "./NavbarLogoutButton";
import NavbarToggleButton from "./NavbarToggleButton";
import { navbarItems } from "@uiHelpers/navbarItems";
import transition from "@utils/layouts/transition";

interface NavbarProps {
  isOpen: boolean;
  onToggleNav: () => void;
  onCloseNav: () => void;
}

const Navbar = ({ isOpen, onToggleNav, onCloseNav }: NavbarProps) => {
  const belowSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const sm_Above = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const md_Above = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const minWidth = "calc(51px + 1.5em)";
  const maxWidth = "calc(67px + 6.85em)";
  let showTooltip: boolean;

  if (md_Above) {
    showTooltip = isOpen;
  } else if (sm_Above) {
    showTooltip = !isOpen;
  } else {
    showTooltip = false;
  }

  const navItems = navbarItems.map(item => {
    if (item.type === "link") {
      const { type: _, ...items } = item;

      return (
        <NavbarLink
          key={item.label}
          {...items}
          isOpen={isOpen}
          showTooltip={showTooltip}
          onClick={belowSm ? onCloseNav : undefined}
        />
      );
    }

    const { type: _, ...items } = item;

    return (
      <NavbarLogoutButton
        key={item.label}
        {...items}
        isOpen={isOpen}
        showTooltip={showTooltip}
      />
    );
  });

  return (
    <NavbarContainer
      isOpen={isOpen}
      belowSm={belowSm}
      onClick={onCloseNav}
      minWidth={minWidth}
      maxWidth={maxWidth}
    >
      <List
        aria-label="Main app navigation"
        sx={({ breakpoints, transitions }) => ({
          height: "100%",
          display: "flex",
          flexDirection: "column",
          rowGap: 3.5,
          [breakpoints.up("sm")]: {
            pr: 3,
            width: isOpen ? maxWidth : minWidth,
            transition: transition(transitions, isOpen, "width"),
          },
          [breakpoints.up("md")]: { width: isOpen ? minWidth : maxWidth },
        })}
      >
        <NavbarToggleButton
          isOpen={isOpen}
          sm_Above={sm_Above}
          md_Above={md_Above}
          onClick={onToggleNav}
        />
        {navItems}
      </List>
    </NavbarContainer>
  );
};

export default Navbar;
