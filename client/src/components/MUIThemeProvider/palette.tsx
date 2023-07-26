import type { ThemeOptions } from "@mui/material/styles";

type Palette = NonNullable<ThemeOptions["palette"]>;

export const sunnyPalette: Palette = {
  mode: "light",
  primary: { light: "#7dd1f3", main: "#149cd2", dark: "#09455d" },
  secondary: { light: "#ccc", main: "#6a6a6a", dark: "#404040" },
  text: {
    primary: "#04232f",
    secondary: "rgba(4,35,47,0.7)",
    disabled: "rgba(4,35,47,0.3)",
  },
  action: {
    active: "rgba(4,35,47,0.5)",
    hover: "rgba(4,35,47,0.04)",
    selected: "rgba(4,35,47,0.08)",
    disabled: "rgba(4,35,47,0.26)",
    disabledBackground: "rgba(4,35,47,0.12)",
  },
  background: { default: "#fff", paper: "#fff" },
  divider: "rgba(4,35,47,0.12)",
};

export const sunsetPalette: Palette = {
  mode: "dark",
  primary: { light: "#d0effb", main: "#7dd1f3", dark: "#0d688c" },
  secondary: { light: "#e6e6e6", main: "#a6a6a6", dark: "#6a6a6a" },
  error: { main: "#ff8080" },
  text: {
    primary: "#d9d9d9",
    secondary: "rgba(217,217,217,0.8)",
    disabled: "rgba(217,217,217,0.4)",
  },
  action: {
    active: "rgba(217,217,217,0.8)",
    hover: "rgba(217,217,217,0.07)",
    selected: "rgba(217,217,217,0.2)",
    disabled: "rgba(217,217,217,0.4)",
    disabledBackground: "rgba(217,217,217,0.2)",
  },
  background: { default: "#09455d", paper: "#09455d" },
  divider: "rgba(217,217,217,0.12)",
};

export const pitchBlackPalette: Palette = {
  mode: "dark",
  primary: { light: "#d0effb", main: "#7dd1f3", dark: "#0d688c" },
  secondary: { light: "#e6e6e6", main: "#a6a6a6", dark: "#6a6a6a" },
  info: { light: "#b9e7f8", main: "#73cef2", dark: "#16ade9" },
  success: { light: "#b8e0b9", main: "#71c174", dark: "#46a049" },
  background: { default: "#021117", paper: "#021117" },
};
