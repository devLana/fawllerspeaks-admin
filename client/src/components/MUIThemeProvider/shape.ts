import type { ThemeOptions } from "@mui/material/styles";

export const shape = (
  fontSize: number
): NonNullable<ThemeOptions["shape"]> => ({
  borderRadius: 15 + fontSize / 6,
});
