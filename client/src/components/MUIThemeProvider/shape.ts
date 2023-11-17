import type { ThemeOptions } from "@mui/material/styles";

type Shape = NonNullable<ThemeOptions["shape"]>;

export const shape = (fontSize: number): Shape => ({
  borderRadius: 7 + fontSize / 6,
});
