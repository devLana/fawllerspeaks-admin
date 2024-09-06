import useMediaQuery from "@mui/material/useMediaQuery";
import List from "@mui/material/List";
import type { Theme } from "@mui/material/styles";

import NavbarContainer from "./components/NavbarContainer";
import NavbarItemLink from "./components/NavbarItemLink";
import NavbarItemButton from "./components/NavbarItemButton";
import NavbarToggleButton from "./components/NavbarToggleButton";
import { navbarItems } from "./utils/navbarItems";
import transition from "./utils/transition";

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
  const onClickNavLink = belowSm ? onCloseNav : undefined;
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
        <NavbarItemLink
          key={item.label}
          {...items}
          isOpen={isOpen}
          showTooltip={showTooltip}
          onClick={onClickNavLink}
        />
      );
    }

    const { type: _, ...items } = item;

    return (
      <NavbarItemButton
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
          onClick={onToggleNav}
        />
        {navItems}
      </List>
    </NavbarContainer>
  );
};

export default Navbar;
