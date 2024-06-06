import type { ThemeOptions } from "@mui/material/styles";
import type { ThemeColors, ThemeMode } from "@types";

type Palette = NonNullable<ThemeOptions["palette"]>;
type AppThemePalette = (themeMode: ThemeMode, color: ThemeColors) => Palette;

const generatePalette = (hex: string, rgb: string, color: ThemeColors) => ({
  text: {
    primary: hex,
    secondary: `rgba(${rgb},0.7)`,
    disabled: `rgba(${rgb},0.3)`,
  },
  action: {
    active: `rgba(${rgb},0.22)`,
    hover: `rgba(${rgb},0.06)`,
    selected: `rgba(${rgb},0.095)`,
    disabled: `rgba(${rgb},0.18)`,
    disabledBackground: `rgba(${rgb},0.12)`,
  },
  divider: `rgba(${rgb},0.12)`,
  themeColor: {
    main: color,
    transparent:
      color === "#7dd1f3" ? "rgba(125,209,243,0.8)" : "rgba(106,106,106,0.5)",
  },
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
            ...generatePalette("#04232f", "4,35,47", color),
          }
        : {
            primary: { light: "#ccc", main: "#6a6a6a", dark: "#404040" },
            secondary: { light: "#7dd1f3", main: "#149cd2", dark: "#09455d" },
            ...generatePalette("#09455d", "9,69,93", color),
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
            secondary: { light: "#e6e6e6", main: "#ccc", dark: "#6a6a6a" },
            ...generatePalette("#d9d9d9", "217,217,217", color),
          }
        : {
            primary: { light: "#e6e6e6", main: "#ccc", dark: "#6a6a6a" },
            secondary: { light: "#d0effb", main: "#7dd1f3", dark: "#0d688c" },
            ...generatePalette("#a2def6", "162,222,246", color),
          }),
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
          secondary: { light: "#e6e6e6", main: "#ccc", dark: "#6a6a6a" },
          ...generatePalette("#fff", "255,255,255", color),
        }
      : {
          primary: { light: "#e6e6e6", main: "#ccc", dark: "#6a6a6a" },
          secondary: { light: "#d0effb", main: "#7dd1f3", dark: "#0d688c" },
          ...generatePalette("#a2def6", "162,222,246", color),
        }),
  };
};
