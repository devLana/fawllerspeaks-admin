import * as React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { MUIThemeContext } from "@context/MUIThemeContext";
import { generateTheme } from "./generateTheme";
import { getStorageTheme, saveStorageTheme } from "@utils/storage";
import type { AppTheme as Theme } from "@types";

const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = React.useState<Theme>({
    themeMode: "sunny",
    fontSize: 14,
    color: "#7dd1f3",
  });

  const theme = React.useMemo(
    () => createTheme(generateTheme(appTheme)),
    [appTheme]
  );

  React.useEffect(() => {
    const defaultTheme = getStorageTheme();
    if (defaultTheme) setAppTheme(defaultTheme);
  }, []);

  return (
    <MUIThemeContext.Provider
      value={(key, value) => {
        setAppTheme({ ...appTheme, [key]: value });
        saveStorageTheme(appTheme, key, value);
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MUIThemeContext.Provider>
  );
};

export default MUIThemeProvider;
