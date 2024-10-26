import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import type { AppThemeItem, ThemeMode } from "types/appTheme";

interface ThemeItemProps extends AppThemeItem {
  isCurrentTheme: boolean;
}

const bgColor: Record<ThemeMode, string> = {
  sunny: "#fff",
  sunset: "#09455d",
  "pitch black": "#021117",
};

const color: Record<ThemeMode, string> = {
  sunny: "#04232f",
  sunset: "#d9d9d9",
  "pitch black": "#fff",
};

const ThemeItem = ({ id, name, Icon, isCurrentTheme }: ThemeItemProps) => (
  <FormControlLabel
    sx={{
      columnGap: 2,
      m: 0,
      py: 0.4,
      pl: 0.625,
      pr: 1.75,
      color: color[id],
      bgcolor: bgColor[id],
      borderRadius: 1,
      ...(isCurrentTheme && {
        border: "1px solid",
        borderColor: "primary.main",
      }),
      "&>span:last-child": {
        display: "inline-flex",
        alignItems: "center",
        columnGap: 1,
      },
    }}
    value={id}
    control={<Radio size="small" sx={{ color: "primary.main" }} />}
    label={
      <>
        {name} <Icon fontSize="small" />
      </>
    }
  />
);

export default ThemeItem;
