import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/AppTheme";
import ThemeItem from "./ThemeItem";
import { appThemes as themes } from "@context/AppTheme/helpers/appThemes";
import type { ThemeMode } from "types/appTheme";

const Theme = ({ themeMode }: { themeMode: ThemeMode }) => {
  const handleAppTheme = useAppTheme();

  return (
    <Box
      component="section"
      aria-labelledby="theme-settings"
      sx={{ mb: 5, pt: 2 }}
    >
      <Typography variant="h2" gutterBottom id="theme-settings">
        Theme
      </Typography>
      <RadioGroup
        row
        name="theme-settings"
        value={themeMode}
        onChange={e => handleAppTheme("themeMode", e.target.value as ThemeMode)}
        sx={{
          bgcolor: "action.disabledBackground",
          p: 2,
          px: { sm: 1.5 },
          borderRadius: 1,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(calc(8em + 63px), 1fr))",
          gap: 2.5,
        }}
      >
        {themes.map(theme => (
          <ThemeItem
            key={theme.id}
            isCurrentTheme={themeMode === theme.id}
            {...theme}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default Theme;
