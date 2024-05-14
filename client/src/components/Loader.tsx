import Box from "@mui/material/Box";
import type { Palette } from "@mui/material/styles";

import type { AppTheme } from "@types";

const stylesOne = (theme: AppTheme, secondary: Palette["secondary"]) => ({
  backgroundColor:
    theme.themeMode === "sunny" ? secondary.main : secondary.dark,
  width: "0.3rem",
  height: "100%",
  "@keyframes pulsateOne": {
    "0%": { transform: "scaleY(0%)" },
    "50%": { transform: "scaleY(100%)" },
    "100%": { transform: "scaleY(0%)" },
  },
});

const stylesTwo = (theme: AppTheme, secondary: Palette["secondary"]) => ({
  backgroundColor:
    theme.themeMode === "sunny" ? secondary.light : secondary.main,
  width: "0.3rem",
  height: "100%",
  "@keyframes pulsateTwo": {
    "0%": { transform: "scaleY(50%)" },
    "20%": { transform: "scaleY(0%)" },
    "80%": { transform: "scaleY(100%)" },
    "100%": { transform: "scaleY(50%)" },
  },
});

const Loader = () => (
  <Box
    aria-label="authenticating user"
    role="progressbar"
    mx="auto"
    height="4rem"
    width="6rem"
    display="flex"
    justifyContent="space-between"
    alignItems="flex-end"
    columnGap="1rem"
  >
    <Box
      sx={({ appTheme, palette: { secondary } }) => ({
        ...stylesOne(appTheme, secondary),
        animation: "pulsateOne 0.7s infinite ease",
      })}
    />
    <Box
      sx={({ appTheme, palette: { secondary } }) => ({
        ...stylesTwo(appTheme, secondary),
        animation: "pulsateTwo 0.7s infinite ease-in",
      })}
    />
    <Box
      sx={({ appTheme, palette: { secondary } }) => ({
        ...stylesOne(appTheme, secondary),
        animation: "pulsateOne 0.7s infinite linear",
      })}
    />
    <Box
      sx={({ appTheme, palette: { secondary } }) => ({
        ...stylesTwo(appTheme, secondary),
        animation: "pulsateTwo 0.7s infinite ease-in-out",
      })}
    />
    <Box
      sx={({ appTheme, palette: { secondary } }) => ({
        ...stylesOne(appTheme, secondary),
        animation: "pulsateOne 0.7s infinite ease-out",
      })}
    />
  </Box>
);

export default Loader;
