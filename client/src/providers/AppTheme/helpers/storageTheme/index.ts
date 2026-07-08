import { DEFAULT_THEME } from "@utils/constants";
import type { AppTheme } from "@appTypes/appTheme";

export const getStorageTheme = (): AppTheme | null => {
  const storageTheme = localStorage.getItem(DEFAULT_THEME);

  if (!storageTheme) return null;

  try {
    const parsed = JSON.parse(storageTheme) as unknown;

    if (
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      parsed === null
    ) {
      return null;
    }

    if (
      !("themeMode" in parsed) ||
      !("fontSize" in parsed) ||
      !("color" in parsed)
    ) {
      return null;
    }

    if (
      parsed.themeMode !== "sunny" &&
      parsed.themeMode !== "sunset" &&
      parsed.themeMode !== "pitch black"
    ) {
      return null;
    }

    if (typeof parsed.fontSize !== "number") {
      return null;
    }

    if (parsed.color !== "#7dd1f3" && parsed.color !== "#6a6a6a") {
      return null;
    }

    const { color, fontSize, themeMode } = parsed;

    return { themeMode, fontSize, color };
  } catch {
    return null;
  }
};

export const saveStorageTheme = <T extends keyof AppTheme>(
  appTheme: AppTheme,
  key: T,
  value: AppTheme[T],
) => {
  const objectTheme = getStorageTheme() ?? appTheme;
  const updatedTheme: AppTheme = { ...objectTheme, [key]: value };
  const themeString = JSON.stringify(updatedTheme);

  localStorage.setItem(DEFAULT_THEME, themeString);
};
