import * as React from "react";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import SettingsMenuItem from "@components/Settings/SettingsMenuItem";
import { settingsLinks } from "@utils/settings/settingsLinks";

const SettingsMenu = () => {
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);
  const isOpen = !!anchor;

  return (
    <>
      <Button
        id="settings-menu-button"
        variant="text"
        startIcon={<FormatListBulletedIcon />}
        onClick={e => setAnchor(e.currentTarget)}
        aria-controls={isOpen ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen || undefined}
        size="small"
      >
        Settings Menu
      </Button>
      <Menu
        id="settings-menu"
        open={isOpen}
        anchorEl={anchor}
        MenuListProps={{ "aria-labelledby": "settings-menu-button" }}
        onClose={() => setAnchor(null)}
      >
        {settingsLinks.map(link => (
          <SettingsMenuItem
            onClick={() => setAnchor(null)}
            key={link.label}
            {...link}
          />
        ))}
      </Menu>
    </>
  );
};

export default SettingsMenu;
