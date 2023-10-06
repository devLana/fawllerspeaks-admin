import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/MUIThemeContext";
import ThemeItem from "./ThemeItem";
import { themes } from "@utils/appThemes";
import type { AppTheme, ThemeMode } from "@types";

const Theme = ({ appTheme }: { appTheme: AppTheme }) => {
  const handleAppTheme = useAppTheme();

  return (
    <Box component="section" sx={{ mb: 5, pt: 2 }}>
      <Typography variant="h2" gutterBottom>
        Theme
      </Typography>
      <RadioGroup
        row
        name="theme-settings"
        value={appTheme.themeMode}
        onChange={e => handleAppTheme("themeMode", e.target.value as ThemeMode)}
        sx={{
          bgcolor: "action.disabledBackground",
          py: 2,
          px: { xs: 2, sm: 1.5 },
          borderRadius: 1,
          rowGap: 2.5,
          columnGap: 2.65,
        }}
      >
        {themes.map(theme => (
          <ThemeItem
            key={theme.id}
            isCurrentTheme={appTheme.themeMode === theme.id}
            {...theme}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default Theme;
