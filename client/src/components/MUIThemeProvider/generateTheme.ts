import type { ThemeOptions as MuiThemeOptions } from "@mui/material/styles";

import { palette } from "./palette";
import { typography } from "./typography";
import { shape } from "./shape";
import { shadows } from "./shadows";
import { components } from "./components";
import type { AppTheme } from "@types";

declare module "@mui/material/styles" {
  interface Theme {
    appTheme: AppTheme;
  }

  interface ThemeOptions {
    appTheme: AppTheme;
  }
}

export const generateTheme = (appTheme: AppTheme): MuiThemeOptions => {
  if (appTheme.themeMode === "sunny") {
    return {
      appTheme,
      palette: palette(appTheme.themeMode, appTheme.color),
      typography: typography(appTheme.fontSize),
      shape: shape(appTheme.fontSize),
      shadows: shadows("4,35,47"),
      components,
    };
  }

  if (appTheme.themeMode === "sunset") {
    return {
      appTheme,
      palette: palette(appTheme.themeMode, appTheme.color),
      typography: typography(appTheme.fontSize),
      shape: shape(appTheme.fontSize),
      shadows: shadows("140,140,140"),
      components,
    };
  }

  return {
    appTheme,
    palette: palette(appTheme.themeMode, appTheme.color),
    typography: typography(appTheme.fontSize),
    shape: shape(appTheme.fontSize),
    shadows: shadows("15,121,163"),
    components,
  };
};
