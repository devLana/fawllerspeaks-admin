import { Lexend } from "next/font/google";

import type { ThemeOptions } from "@mui/material/styles";
import type { TypographyStyleOptions } from "@mui/material/styles/createTypography";

type Typo = (fontSize: number) => NonNullable<ThemeOptions["typography"]>;

const lexend = Lexend({ subsets: ["latin"], display: "swap" });

export const typography: Typo = fontSize => {
  const styles: TypographyStyleOptions = {
    wordBreak: "break-word",
    hyphens: "auto",
  };

  return {
    fontFamily: lexend.style.fontFamily,
    fontSize,
    h1: { fontSize: "2em", ...styles },
    h2: { fontSize: "1.58em", ...styles },
    h3: { fontSize: "1.35em", ...styles },
    h4: { fontSize: "1.2em", ...styles },
    h5: { fontSize: "1em", ...styles },
    h6: { fontSize: "0.85em", ...styles },
    body1: { lineHeight: 1.6, ...styles },
  };
};
