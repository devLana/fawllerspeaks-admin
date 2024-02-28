import * as React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AppThemeContext } from ".";
import { generateTheme } from "./utils/generateTheme";
import { getStorageTheme, saveStorageTheme } from "@utils/storage";
import type { AppTheme as Theme } from "@types";

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = React.useState<Theme>({
    themeMode: "sunny",
    fontSize: 14,
    color: "#7dd1f3",
  });

  const theme = React.useMemo(() => {
    return createTheme(generateTheme(appTheme));
  }, [appTheme]);

  React.useEffect(() => {
    const defaultTheme = getStorageTheme();
    if (defaultTheme) setAppTheme(defaultTheme);
  }, []);

  const handleAppTheme = <T extends keyof Theme>(key: T, value: Theme[T]) => {
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
