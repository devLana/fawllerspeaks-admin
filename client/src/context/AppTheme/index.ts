import * as React from "react";
import type { AppTheme } from "@types";

type AppThemeHandler = <T extends keyof AppTheme>(
  key: T,
  value: AppTheme[T]
) => void;

type AppThemeValue = AppThemeHandler | null;

export const AppThemeContext = React.createContext<AppThemeValue>(null);

export const useAppTheme = () => {
  const value = React.useContext(AppThemeContext);

  if (!value) {
    throw new ReferenceError("AppTheme context provider not available");
  }

  return value;
};
