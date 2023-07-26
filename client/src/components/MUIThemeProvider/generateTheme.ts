import type { ThemeOptions as MuiThemeOptions } from "@mui/material/styles";

import { pitchBlackPalette, sunnyPalette, sunsetPalette } from "./palette";
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
  if (appTheme === "sunny") {
    return {
      appTheme,
      palette: sunnyPalette,
      typography,
      shape,
      shadows: shadows("4,35,47"),
      components,
    };
  }

  if (appTheme === "sunset") {
    return {
      appTheme,
      palette: sunsetPalette,
      typography,
      shape,
      shadows: shadows("140,140,140"),
      components,
    };
  }

  return {
    appTheme,
    palette: pitchBlackPalette,
    typography,
    shape,
    shadows: shadows("20,156,210"),
    components,
  };
};
