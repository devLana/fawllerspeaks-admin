import * as React from "react";

import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useAppTheme } from "@context/AppTheme";
import { normalizedThemes, themes } from "@utils/appThemes";
import type { ThemeMode } from "@types";

const AuthLayoutThemeButton = () => {
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);
  const { appTheme } = useTheme();

  const handleAppTheme = useAppTheme();

  const handleThemeChange = (id: ThemeMode) => {
    setAnchor(null);
    handleAppTheme("themeMode", id);
  };

  const isOpen = !!anchor;
  const { name: theme, Icon: ThemeIcon } = normalizedThemes[appTheme.themeMode];

  return (
    <>
      <Button
        id="app-theme-button"
        variant="outlined"
        size="small"
        aria-controls={isOpen ? "app-theme-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen || undefined}
        startIcon={<ThemeIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={e => setAnchor(e.currentTarget)}
        sx={{ mb: 2 }}
      >
        {theme}
      </Button>
      <Menu
        id="app-theme-menu"
        open={isOpen}
        anchorEl={anchor}
        MenuListProps={{ "aria-labelledby": "app-theme-button" }}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {themes.map(({ Icon, name, id }) => (
          <MenuItem
            key={id}
            selected={id === appTheme.themeMode}
            onClick={() => handleThemeChange(id)}
          >
            <Icon /> &nbsp; {name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AuthLayoutThemeButton;
