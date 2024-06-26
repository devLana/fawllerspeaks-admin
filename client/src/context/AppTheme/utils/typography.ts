import { Lexend } from "next/font/google";
import type { ThemeOptions } from "@mui/material/styles";

type Typo = (fontSize: number) => NonNullable<ThemeOptions["typography"]>;

const lexend = Lexend({ subsets: ["latin"], display: "swap" });

export const typography: Typo = fontSize => ({
  fontFamily: lexend.style.fontFamily,
  fontSize,
  h1: { fontSize: "2em" },
  h2: { fontSize: "1.58em" },
  h3: { fontSize: "1.35em" },
  h4: { fontSize: "1.2em" },
  h5: { fontSize: "1em" },
  h6: { fontSize: "0.85em" },
  body1: { lineHeight: 1.6 },
});
