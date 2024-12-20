import { DEFAULT_THEME } from "@utils/constants";
import type { AppTheme } from "types/appTheme";

export const getStorageTheme = (): AppTheme | null => {
  const storageTheme = localStorage.getItem(DEFAULT_THEME);

  if (!storageTheme) return null;

  try {
    const defaultTheme = JSON.parse(storageTheme) as Record<
      keyof AppTheme,
      unknown
    >;

    if (
      !Object.hasOwn(defaultTheme, "themeMode") ||
      !Object.hasOwn(defaultTheme, "fontSize") ||
      !Object.hasOwn(defaultTheme, "color")
    ) {
      return null;
    }

    if (
      defaultTheme.themeMode !== "sunny" &&
      defaultTheme.themeMode !== "sunset" &&
      defaultTheme.themeMode !== "pitch black"
    ) {
      return null;
    }

    if (typeof defaultTheme.fontSize !== "number") return null;

    if (defaultTheme.color !== "#7dd1f3" && defaultTheme.color !== "#6a6a6a") {
      return null;
    }

    const { color, fontSize, themeMode } = defaultTheme;

    return { themeMode, fontSize, color };
  } catch {
    return null;
  }
};

export const saveStorageTheme = <T extends keyof AppTheme>(
  appTheme: AppTheme,
  key: T,
  value: AppTheme[T]
) => {
  const objectTheme = getStorageTheme() ?? appTheme;
  const updatedTheme: AppTheme = { ...objectTheme, [key]: value };
  const themeString = JSON.stringify(updatedTheme);

  localStorage.setItem(DEFAULT_THEME, themeString);
};
