import { RightTransition } from "@components/SlideTransitions";
import type { ThemeOptions } from "@mui/material/styles";

type Components = NonNullable<ThemeOptions["components"]>;

export const components: Components = {
  MuiLink: {
    defaultProps: { underline: "none" },
    styleOverrides: {
      root: ({ theme: { appTheme, palette, transitions } }) => ({
        transition: transitions.create("color"),
        fontStyle: "oblique",
        ":hover": {
          color:
            appTheme.themeMode === "sunny"
              ? palette.primary.dark
              : appTheme.themeMode === "sunset"
              ? palette.primary.light
              : palette.primary.light,
        },
      }),
    },
  },
  MuiTypography: {
    styleOverrides: {
      gutterBottom: ({ ownerState: { variant, gutterBottom } }) => ({
        ...(variant === "body1" && gutterBottom && { marginBottom: "0.7rem" }),
      }),
    },
  },
  MuiButton: { styleOverrides: { root: { textTransform: "capitalize" } } },
  MuiCard: {
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        [theme.breakpoints.down("sm")]: {
          ...(ownerState.variant === "outlined" && { border: 0 }),
          ...(ownerState.raised && {
            boxShadow: "none",
            backgroundImage: "none",
          }),
        },
        transition: "none",
      }),
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        [theme.breakpoints.down("sm")]: { paddingLeft: 0, paddingRight: 0 },
      }),
    },
  },
  MuiSnackbar: {
    defaultProps: {
      TransitionComponent: RightTransition,
      autoHideDuration: 4000,
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        ...(!ownerState.action && { justifyContent: "center" }),
        flexGrow: 0,
        minWidth: "11rem",
      }),
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        [theme.breakpoints.up("lg")]: { maxWidth: 1000 },
      }),
    },
  },
  MuiSkeleton: {
    defaultProps: { animation: "wave" },
    styleOverrides: {
      wave: ({ theme }) => ({
        ...(theme.appTheme.themeMode === "sunny" && {
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(4,35,47,0.08), transparent)",
          },
        }),
      }),
    },
  },
};
