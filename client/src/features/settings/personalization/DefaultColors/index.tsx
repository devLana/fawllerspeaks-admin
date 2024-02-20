import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/AppTheme";
import DefaultColor from "./DefaultColor";
import type { AppTheme } from "@types";

const colors = [
  { themeColor: "#7dd1f3", light: "#7dd1f3", dark: "#149cd2", label: "Blue" },
  { themeColor: "#6a6a6a", light: "#ccc", dark: "#6a6a6a", label: "Gray" },
] as const;

const DefaultColors = ({ appTheme }: { appTheme: AppTheme }) => {
  const handleAppTheme = useAppTheme();

  return (
    <Box component="section">
      <Typography variant="h2" gutterBottom>
        Default Color
      </Typography>
      <Box
        py={2}
        px={{ xs: 2, sm: 1.5 }}
        bgcolor="action.disabledBackground"
        borderRadius={1}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          rowGap={2.5}
          columnGap={5}
          justifyContent={{ sm: "flex-start" }}
        >
          {colors.map(color => (
            <DefaultColor
              key={color.label}
              onClick={handleAppTheme}
              isDefaultColor={appTheme.color === color.themeColor}
              {...color}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default DefaultColors;
