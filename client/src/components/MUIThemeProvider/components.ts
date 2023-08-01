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
            appTheme === "sunny"
              ? palette.primary.dark
              : appTheme === "sunset"
              ? palette.primary.light
              : palette.primary.light,
        },
      }),
    },
  },
  MuiTypography: {
    styleOverrides: {
      gutterBottom: ({ ownerState }) => ({
        ...(ownerState.variant === "body1" &&
          ownerState.gutterBottom && { marginBottom: "0.7rem" }),
      }),
    },
  },
  MuiButton: { styleOverrides: { root: { textTransform: "capitalize" } } },
  MuiCard: {
    styleOverrides: {
      root: ({ ownerState, theme }) => {
        let styles: Record<string, unknown> = {};

        if (ownerState.variant === "outlined") {
          styles = { [theme.breakpoints.down("sm")]: { border: 0 } };
        }

        if (ownerState.raised) {
          styles = {
            [theme.breakpoints.down("sm")]: {
              boxShadow: "none",
              backgroundImage: "none",
            },
          };
        }

        return { ...styles, transition: "none" };
      },
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
      autoHideDuration: 3500,
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        flexGrow: 0,
        justifyContent: !ownerState.action ? "center" : "normal",
        minWidth: "11rem",
      }),
    },
  },
};
