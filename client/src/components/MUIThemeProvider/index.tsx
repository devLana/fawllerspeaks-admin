import * as React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { MUIThemeContext } from "@context/MUIThemeContext";
import { generateTheme } from "./generateTheme";
import { DEFAULT_THEME } from "@utils/constants";
import type { AppTheme } from "@types";

const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = React.useState<AppTheme>("sunny");

  const theme = React.useMemo(() => {
    return createTheme(generateTheme(appTheme));
  }, [appTheme]);

  React.useEffect(() => {
    const defaultTheme = localStorage.getItem(DEFAULT_THEME) as AppTheme | null;

    if (defaultTheme) {
      setAppTheme(defaultTheme);
    }
  }, []);

  const handleAppTheme = (newTheme: AppTheme) => setAppTheme(newTheme);

  return (
    <MUIThemeContext.Provider value={handleAppTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MUIThemeContext.Provider>
  );
};

export default MUIThemeProvider;
