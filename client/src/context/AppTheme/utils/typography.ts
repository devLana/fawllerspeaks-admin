import type { ThemeOptions } from "@mui/material/styles";

type Typo = (fontSize: number) => NonNullable<ThemeOptions["typography"]>;

export const typography: Typo = fontSize => ({
  fontFamily: '"Lexend", sans-serif',
  fontSize,
  h1: { fontSize: "2em" },
  h2: { fontSize: "1.8em" },
  h3: { fontSize: "1.7em" },
  h4: { fontSize: "1.6em" },
  h5: { fontSize: "1.4em" },
  h6: { fontSize: "1.25em" },
  body1: { lineHeight: 1.6 },
});
