import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import type { ThemeMode } from "@types";
import type { AppThemeItem } from "@utils/appThemes";

interface ThemeItemProps extends AppThemeItem {
  currentTheme: ThemeMode;
  onChange: (id: ThemeMode) => void;
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

const ThemeItem = (props: ThemeItemProps) => {
  const { id, name, Icon, currentTheme, onChange } = props;

  const label = (
    <>
      {name} <Icon />
    </>
  );

  return (
    <FormControlLabel
      key={id}
      sx={{
        flexGrow: 1,
        m: 0,
        py: 0.4,
        pl: 0.4,
        pr: 1.3,
        color: color[id],
        bgcolor: bgColor[id],
        borderRadius: 1,
        ...(currentTheme === id && {
          borderColor: "primary.main",
          borderWidth: 1,
          borderStyle: "solid",
        }),
        "&>span:last-child": {
          ml: 0.5,
          display: "inline-flex",
          alignItems: "center",
          columnGap: 1,
        },
      }}
      control={
        <Checkbox
          onChange={() => onChange(id)}
          size="small"
          checked={currentTheme === id}
          sx={{ color: "primary.main" }}
        />
      }
      label={label}
    />
  );
};

export default ThemeItem;
