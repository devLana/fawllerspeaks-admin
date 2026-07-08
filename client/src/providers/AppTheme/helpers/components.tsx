import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import type { ThemeOptions } from "@mui/material/styles";

type Components = NonNullable<ThemeOptions["components"]>;

export const components: Components = {
  MuiAlert: {
    defaultProps: {
      iconMapping: {
        success: <CheckCircleOutlinedIcon />,
        error: <CancelOutlinedIcon />,
      },
    },
  },
  MuiButton: {
    defaultProps: { loadingPosition: "end" },
    styleOverrides: {
      root: ({ theme: { appTheme, palette } }) => ({
        textTransform: "capitalize",
        ...(appTheme.themeMode !== "sunny" && {
          ":hover": { color: palette.primary.light },
        }),
      }),
    },
  },
  MuiButtonGroup: { styleOverrides: { root: { display: "flex" } } },
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
  MuiCssBaseline: {
    styleOverrides: `
      html {
        font-size: 16px;
      }
      p {
        word-break: break-word;
        hyphens: auto;
      }
    `,
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
  MuiTypography: {
    styleOverrides: {
      gutterBottom: ({ ownerState: { variant, gutterBottom } }) => ({
        ...(variant === "body1" && gutterBottom && { marginBottom: "0.7em" }),
        ...(variant?.match(/^h[0-6]$/) &&
          gutterBottom && { marginBottom: "1em" }),
      }),
    },
  },
};
