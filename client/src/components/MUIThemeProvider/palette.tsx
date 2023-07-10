import type { ThemeOptions } from "@mui/material/styles";

type Palette = NonNullable<ThemeOptions["palette"]>;

export const sunnyPalette: Palette = {
  mode: "light",
  primary: {
    light: "#7dd1f3",
    main: "#118bbb",
    dark: "#0d688c",
  },
  secondary: {
    light: "#b3b3b3",
    main: "#6a6a6a",
    dark: "#404040",
  },
  warning: {
    light: "#c7d926",
    main: "#778217",
    dark: "#3c410b",
  },
  info: {
    light: "#73cef2",
    main: "#16ade9",
    dark: "#0d688c",
  },
  success: {
    light: "#71c174",
    main: "#3e8e41",
    dark: "#275929",
  },
  text: {
    primary: "#04232f",
    secondary: "rgba(4, 35, 47, 0.7)",
    disabled: "rgba(4, 35, 47, 0.3)",
  },
  action: {
    active: "rgba(4, 35, 47, 0.5)",
    hover: "rgba(4, 35, 47, 0.04)",
    selected: "rgba(4, 35, 47, 0.08)",
    disabled: "rgba(4, 35, 47, 0.26)",
    disabledBackground: "rgba(4, 35, 47, 0.12)",
  },
  background: { default: "#fff", paper: "#fff" },
  divider: "rgba(4, 35, 47, 0.12)",
};

export const sunsetPalette: Palette = {
  mode: "dark",
  primary: {
    light: "#a2def6",
    main: "#7dd1f3",
    dark: "#118bbb",
  },
  secondary: {
    light: "#d9d9d9",
    main: "#b3b3b3",
    dark: "#6a6a6a",
  },
  warning: {
    light: "#dde87d",
    main: "#c7d926",
    dark: "#778217",
  },
  error: {
    light: "#fcc",
    main: "#ff8080",
    dark: "#f33",
  },
  info: {
    light: "#a2def6",
    main: "#5cc6f0",
    dark: "#16ade9",
  },
  success: {
    light: "#a6d8a8",
    main: "#71c174",
    dark: "#3e8e41",
  },
  text: {
    primary: "#d9d9d9",
    secondary: "rgba(217, 217, 217, 0.8)",
    disabled: "rgba(217, 217, 217, 0.4)",
  },
  action: {
    active: "rgba(217, 217, 217, 0.8)",
    hover: "rgba(217, 217, 217, 0.07)",
    selected: "rgba(217, 217, 217, 0.2)",
    disabled: "rgba(217, 217, 217, 0.4)",
    disabledBackground: "rgba(217, 217, 217, 0.2)",
  },
  background: { default: "#09455d", paper: "#09455d" },
  divider: "rgba(217, 217, 217, 0.12)",
};

export const pitchBlackPalette: Palette = {
  mode: "dark",
  primary: {
    light: "#a2def6",
    main: "#7dd1f3",
    dark: "#118bbb",
  },
  secondary: {
    light: "#d9d9d9",
    main: "#b3b3b3",
    dark: "#6a6a6a",
  },
  warning: {
    light: "#e3ec93",
    main: "#cddd3c",
    dark: "#9fad1f",
  },
  info: {
    light: "#b9e7f8",
    main: "#73cef2",
    dark: "#16ade9",
  },
  error: {
    light: "#f99",
    main: "#f00",
    dark: "#c00",
  },
  success: {
    light: "#b8e0b9",
    main: "#71c174",
    dark: "#46a049",
  },
  background: { default: "#021117", paper: "#021117" },
};
