import type { ThemeOptions } from "@mui/material/styles";

import type { ThemeColors, ThemeMode } from "@types";

type Palette = NonNullable<ThemeOptions["palette"]>;
type AppThemePalette = (themeMode: ThemeMode, color: ThemeColors) => Palette;

const generatePalette = (hex: string, rgb: string) => ({
  text: {
    primary: hex,
    secondary: `rgba(${rgb},0.7)`,
    disabled: `rgba(${rgb},0.3)`,
  },
  action: {
    active: `rgba(${rgb},0.5)`,
    hover: `rgba(${rgb},0.04)`,
    selected: `rgba(${rgb},0.08)`,
    disabled: `rgba(${rgb},0.26)`,
    disabledBackground: `rgba(${rgb},0.12)`,
  },
  divider: `rgba(${rgb},0.12)`,
});

export const palette: AppThemePalette = (themeMode, color) => {
  if (themeMode === "sunny") {
    return {
      mode: "light",
      background: { default: "#fff", paper: "#fff" },
      ...(color === "#7dd1f3"
        ? {
            primary: { light: "#7dd1f3", main: "#149cd2", dark: "#09455d" },
            secondary: { light: "#ccc", main: "#6a6a6a", dark: "#404040" },
            ...generatePalette("#04232f", "4,35,47"),
          }
        : {
            primary: { light: "#ccc", main: "#6a6a6a", dark: "#404040" },
            secondary: { light: "#7dd1f3", main: "#149cd2", dark: "#09455d" },
            ...generatePalette("#333", "51,51,51"),
          }),
    };
  }

  if (themeMode === "sunset") {
    return {
      mode: "dark",
      background: { default: "#09455d", paper: "#09455d" },
      error: { main: "#ff8080" },
      ...(color === "#7dd1f3"
        ? {
            primary: { light: "#d0effb", main: "#7dd1f3", dark: "#0d688c" },
            secondary: { light: "#e6e6e6", main: "#a6a6a6", dark: "#6a6a6a" },
          }
        : {
            primary: { light: "#e6e6e6", main: "#a6a6a6", dark: "#6a6a6a" },
            secondary: { light: "#d0effb", main: "#7dd1f3", dark: "#0d688c" },
          }),
      ...generatePalette("#d9d9d9", "217,217,217"),
    };
  }

  return {
    mode: "dark",
    background: { default: "#021117", paper: "#021117" },
    info: { light: "#b9e7f8", main: "#73cef2", dark: "#16ade9" },
    success: { light: "#b8e0b9", main: "#71c174", dark: "#46a049" },
    ...(color === "#7dd1f3"
      ? {
          primary: { light: "#d0effb", main: "#7dd1f3", dark: "#0d688c" },
          secondary: { light: "#e6e6e6", main: "#a6a6a6", dark: "#6a6a6a" },
        }
      : {
          primary: { light: "#e6e6e6", main: "#a6a6a6", dark: "#6a6a6a" },
          secondary: { light: "#d0effb", main: "#7dd1f3", dark: "#0d688c" },
        }),
  };
};
