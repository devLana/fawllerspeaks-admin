import { useEffect, useMemo, useState } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AppThemeContext } from "@contexts/AppTheme";
import { palette } from "./helpers/palette";
import { typography } from "./helpers/typography";
import { shape } from "./helpers/shape";
import { shadows } from "./helpers/shadows";
import { components } from "./helpers/components";
import { getStorageTheme, saveStorageTheme } from "./helpers/storageTheme";
import type { AppTheme, AppThemeHandler } from "@appTypes/appTheme";

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = useState<AppTheme>({
    themeMode: "sunny",
    fontSize: 14,
    color: "#7dd1f3",
  });

  useEffect(() => {
    const defaultTheme = getStorageTheme();
    if (defaultTheme) setAppTheme(defaultTheme);
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      appTheme,
      palette: palette(appTheme.themeMode, appTheme.color),
      typography: typography(appTheme.fontSize),
      shape: shape(appTheme.fontSize),
      shadows,
      components,
    });
  }, [appTheme]);

  const handleAppTheme: AppThemeHandler = (key, value) => {
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
