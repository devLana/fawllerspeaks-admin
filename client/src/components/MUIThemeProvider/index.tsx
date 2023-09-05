import * as React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { MUIThemeContext } from "@context/MUIThemeContext";
import { generateTheme } from "./generateTheme";
import { storage } from "@utils/storage";
import type { AppTheme } from "@types";

const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = React.useState<AppTheme>({
    themeMode: "sunny",
    fontSize: 16,
    color: "#7dd1f3",
  });

  const handleAppTheme = <T extends keyof AppTheme>(
    key: T,
    value: AppTheme[T]
  ) => {
    setAppTheme({ ...appTheme, [key]: value });
    storage.setAppTheme(appTheme, key, value);
  };

  const theme = React.useMemo(
    () => createTheme(generateTheme(appTheme)),
    [appTheme]
  );

  React.useEffect(() => {
    const defaultTheme = storage.getAppTheme();

    console.log(defaultTheme);

    if (defaultTheme) setAppTheme(defaultTheme);
  }, []);

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
