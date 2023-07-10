import * as React from "react";
import type { AppTheme } from "@types";

type AppThemeHandler = (theme: AppTheme) => void;
type MUIThemeContextValue = AppThemeHandler | null;

export const MUIThemeContext = React.createContext<MUIThemeContextValue>(null);

export const useAppTheme = () => {
  const value = React.useContext(MUIThemeContext);

  if (!value) {
    throw new ReferenceError("MuiThemeContext provider not available");
  }

  return value;
};
