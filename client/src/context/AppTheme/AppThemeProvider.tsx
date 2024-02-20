import * as React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AppThemeContext } from ".";
import { generateTheme } from "./utils/generateTheme";
import { getStorageTheme, saveStorageTheme } from "@utils/storage";
import type { AppTheme } from "@types";

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = React.useState<AppTheme>({
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

  return (
    <AppThemeContext.Provider
      value={(key, value) => {
        setAppTheme({ ...appTheme, [key]: value });
        saveStorageTheme(appTheme, key, value);
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
};

export default AppThemeProvider;
