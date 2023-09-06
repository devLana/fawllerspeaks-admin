import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/MUIThemeContext";
import ThemeItem from "./ThemeItem";
import { themes } from "@utils/appThemes";
import type { ThemeMode } from "@types";

const Theme = () => {
  const { appTheme } = useTheme();
  const handleAppTheme = useAppTheme();

  const handleChange = (id: ThemeMode) => {
    handleAppTheme("themeMode", id);
  };

  return (
    <Box sx={{ mb: 5 }} component="section">
      <Typography variant={"h2"} gutterBottom fontSize="16px">
        Theme
      </Typography>
      <Box
        sx={{
          py: 2,
          px: { xs: 2, sm: 1.5 },
          bgcolor: "action.disabledBackground",
          borderRadius: 1,
        }}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ rowGap: 2.5, columnGap: 2.65 }}
        >
          {themes.map(theme => (
            <ThemeItem
              key={theme.id}
              currentTheme={appTheme.themeMode}
              onChange={handleChange}
              {...theme}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Theme;
