import * as React from "react";

import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useAppTheme } from "@context/MUIThemeContext";
import { DEFAULT_THEME } from "@utils/constants";
import { normalizedThemes, themes } from "@utils/appThemes";
import type { AppTheme } from "@types";

const AuthRootLayoutThemeButton = () => {
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);
  const { appTheme } = useTheme();

  const handleAppTheme = useAppTheme();

  const handleThemeChange = (id: AppTheme) => {
    setAnchor(null);
    handleAppTheme(id);
    localStorage.setItem(DEFAULT_THEME, id);
  };

  const isOpen = !!anchor;
  const { name: themeName, Icon: ThemeIcon } = normalizedThemes[appTheme];

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
        {themeName}
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
            selected={id === appTheme}
            onClick={() => handleThemeChange(id)}
          >
            <Icon /> &nbsp; {name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AuthRootLayoutThemeButton;
