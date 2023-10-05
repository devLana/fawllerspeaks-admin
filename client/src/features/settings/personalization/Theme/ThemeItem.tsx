import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import type { AppThemeItem } from "@utils/appThemes";
import type { ThemeMode } from "@types";

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
      flexGrow: 1,
      columnGap: 3,
      m: 0,
      py: 0.4,
      pl: 0.4,
      pr: 1.3,
      color: color[id],
      bgcolor: bgColor[id],
      borderRadius: 1,
      ...(isCurrentTheme && {
        borderColor: "primary.main",
        borderWidth: 1,
        borderStyle: "solid",
      }),
      "&>span:last-child": {
        display: "inline-flex",
        alignItems: "center",
        columnGap: 2,
      },
    }}
    value={id}
    control={<Radio size="small" sx={{ color: "primary.main" }} />}
    label={
      <>
        {name} <Icon />
      </>
    }
  />
);

export default ThemeItem;
