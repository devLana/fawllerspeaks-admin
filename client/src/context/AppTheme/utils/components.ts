import type { ThemeOptions } from "@mui/material/styles";

import Right from "@components/SlideTransitions/Right";
import Up from "@components/SlideTransitions/Up";

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
        ...(variant === "body1" && gutterBottom && { marginBottom: "0.7em" }),
        ...(variant?.match(/^h[0-6]$/) &&
          gutterBottom && { marginBottom: "0.75em" }),
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme: { appTheme, palette } }) => ({
        textTransform: "capitalize",
        ...(appTheme.themeMode !== "sunny" && {
          ":hover": { color: palette.primary.light },
        }),
      }),
    },
  },
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
    defaultProps: { TransitionComponent: Right, autoHideDuration: 4000 },
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
  MuiCssBaseline: {
    styleOverrides: `
      html {
        font-size: 16px;
      }
    `,
  },
  MuiDialog: {
    defaultProps: {
      TransitionComponent: Up,
      transitionDuration: { enter: 220, exit: 100 },
    },
    styleOverrides: {
      root: {
        '&>div[class^="MuiBackdrop-root"]': { backdropFilter: "blur(4px)" },
      },
    },
  },
  MuiAlert: { styleOverrides: { root: { display: "inline-flex" } } },
};
