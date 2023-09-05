import { DEFAULT_THEME } from "@utils/constants";
import type { AppTheme } from "@types";

class LocalStorageDefaultTheme {
  getAppTheme(): AppTheme | null {
    const storageTheme = localStorage.getItem(DEFAULT_THEME);

    if (!storageTheme) return null;

    const defaultTheme = JSON.parse(storageTheme) as AppTheme;

    if (
      !("themeMode" in defaultTheme) ||
      !("fontSize" in defaultTheme) ||
      !("color" in defaultTheme)
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

    return defaultTheme;
  }

  setAppTheme<T extends keyof AppTheme>(
    appTheme: AppTheme,
    key: T,
    value: AppTheme[T]
  ) {
    const objectTheme = this.getAppTheme() ?? appTheme;
    const updatedTheme: AppTheme = { ...objectTheme, [key]: value };
    const themeString = JSON.stringify(updatedTheme);

    localStorage.setItem(DEFAULT_THEME, themeString);
  }
}

export const storage = new LocalStorageDefaultTheme();
