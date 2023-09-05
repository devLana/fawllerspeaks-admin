import type { ThemeOptions } from "@mui/material/styles";

export const typography = (
  fontSize: number
): NonNullable<ThemeOptions["typography"]> => ({
  fontFamily: '"Lexend", sans-serif',
  fontSize,
  h1: { fontSize: "2rem" },
  h2: { fontSize: "1.8rem" },
  h3: { fontSize: "1.7rem" },
  h4: { fontSize: "1.6rem" },
  h5: { fontSize: "1.4rem" },
  h6: { fontSize: "1.25rem" },
  body1: { lineHeight: 1.6 },
});
