import type { MuiIconType } from "@appTypes";

export type ThemeMode = "sunny" | "sunset" | "pitch black";
type CapitalizeThemeMode = "Sunny" | "Sunset" | "Pitch Black";
export type ThemeColors = "#7dd1f3" | "#6a6a6a";

interface ThemeColor {
  main: ThemeColors;
  transparent: string;
}

export interface AppTheme {
  themeMode: ThemeMode;
  fontSize: number;
  color: ThemeColors;
}

export type AppThemeHandler = <T extends keyof AppTheme>(
  key: T,
  value: AppTheme[T],
) => void;

export interface AppThemeItem {
  id: ThemeMode;
  name: CapitalizeThemeMode;
  Icon: MuiIconType;
}

declare module "@mui/material/styles" {
  interface Theme {
    appTheme: AppTheme;
  }

  interface ThemeOptions {
    appTheme: AppTheme;
  }

  interface Palette {
    themeColor: ThemeColor;
  }

  interface PaletteOptions {
    themeColor: ThemeColor;
  }
}
