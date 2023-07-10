import * as React from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";

import SidebarItem from "./components/SidebarItem";
import SidebarLogoutButton from "./components/SidebarLogoutButton";
import SidebarNewLink from "./components/SidebarNewLink";
import SidebarToggleButton from "./components/SidebarToggleButton";
import { topLinks, postLinks, otherLinks } from "./sidebarMenu";
import transition from "../../transition";

interface SidebarProps {
  smDrawerWidth: string;
  drawerWidth: string;
  onToggle: () => void;
  isOpen: boolean;
  setSideBarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  smDrawerWidth,
  drawerWidth,
  isOpen,
  onToggle,
  setSideBarIsOpen,
}: SidebarProps) => {
  const theme = useTheme();
  const smMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));

  React.useEffect(() => {
    if (mdMatches) {
      setSideBarIsOpen(true);
    } else {
      setSideBarIsOpen(false);
    }
  }, [mdMatches, setSideBarIsOpen]);

  return (
    <Drawer
      open={smMatches || isOpen}
      onClose={smMatches ? undefined : onToggle}
      variant={smMatches ? "permanent" : "temporary"}
      sx={{
        "& .MuiDrawer-paper": {
          [theme.breakpoints.up("sm")]: {
            width: isOpen ? drawerWidth : smDrawerWidth,
            transition: transition(theme, isOpen, "width"),
          },
        },
      }}
    >
      <nav>
        <SidebarToggleButton isOpen={isOpen} onToggle={onToggle} />
        <List>
          {topLinks.map(({ primary, ...link }) => (
            <React.Fragment key={link.label}>
              {primary ? (
                <SidebarNewLink
                  {...link}
                  isOpen={isOpen}
                  smMatches={smMatches}
                />
              ) : (
                <SidebarItem {...link} isOpen={isOpen} smMatches={smMatches} />
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
        <List>
          {postLinks.map(link => (
            <SidebarItem
              key={link.label}
              {...link}
              isOpen={isOpen}
              smMatches={smMatches}
            />
          ))}
        </List>
        <Divider />
        <List>
          {otherLinks.map(({ Icon, label, ...link }) => (
            <React.Fragment key={label}>
              {link.type === "link" ? (
                <SidebarItem
                  label={label}
                  href={link.href}
                  Icon={Icon}
                  isOpen={isOpen}
                  smMatches={smMatches}
                />
              ) : (
                <SidebarLogoutButton
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

export default Sidebar;
