import * as React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AppThemeContext } from ".";
import { palette } from "./utils/palette";
import { typography } from "./utils/typography";
import { shape } from "./utils/shape";
import { shadows } from "./utils/shadows";
import { components } from "./utils/components";
import { getStorageTheme, saveStorageTheme } from "./utils/storage";
import type { AppTheme, ThemeColor } from "./types";

type ThemeKeys = keyof AppTheme;

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
