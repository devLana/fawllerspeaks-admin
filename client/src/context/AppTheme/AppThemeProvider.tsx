import * as React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AppThemeContext } from ".";
import { palette } from "./helpers/palette";
import { typography } from "./helpers/typography";
import { shape } from "./helpers/shape";
import { shadows } from "./helpers/shadows";
import { components } from "./helpers/components";
import { getStorageTheme, saveStorageTheme } from "./helpers/storage";
import type { AppTheme } from "types/appTheme";

type ThemeKeys = keyof AppTheme;

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = React.useState<AppTheme>({
    themeMode: "sunny",
    fontSize: 14,
    color: "#7dd1f3",
  });

  React.useEffect(() => {
    const defaultTheme = getStorageTheme();
    if (defaultTheme) setAppTheme(defaultTheme);
  }, []);

  const theme = React.useMemo(() => {
    return createTheme({
      appTheme,
      palette: palette(appTheme.themeMode, appTheme.color),
      typography: typography(appTheme.fontSize),
      shape: shape(appTheme.fontSize),
      shadows,
      components,
    });
  }, [appTheme]);

  const handleAppTheme = <T extends ThemeKeys>(key: T, value: AppTheme[T]) => {
    setAppTheme({ ...appTheme, [key]: value });
    saveStorageTheme(appTheme, key, value);
  };

  return (
    <AppThemeContext.Provider value={handleAppTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
};

export default AppThemeProvider;
