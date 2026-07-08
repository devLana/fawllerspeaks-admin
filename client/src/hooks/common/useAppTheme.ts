import { useContext } from "react";
import { AppThemeContext } from "@contexts/AppTheme";

export const useAppTheme = () => {
  const value = useContext(AppThemeContext);

  if (!value) {
    throw new ReferenceError("AppTheme context provider not available");
  }

  return value;
};
