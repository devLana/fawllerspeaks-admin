import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/AppTheme";
import DefaultColor from "./DefaultColor";
import type { ThemeColors } from "@types";

const colors = [
  { themeColor: "#7dd1f3", light: "#7dd1f3", dark: "#149cd2", label: "Blue" },
  { themeColor: "#6a6a6a", light: "#ccc", dark: "#6a6a6a", label: "Gray" },
] as const;

const DefaultColors = ({ color }: { color: ThemeColors }) => {
  const handleAppTheme = useAppTheme();

  return (
    <section>
      <Typography variant="h2" gutterBottom>
        Default Color
      </Typography>
      <Box
        p={2}
        px={{ sm: 1.5 }}
        bgcolor="action.disabledBackground"
        borderRadius={1}
      >
        <Box display="flex" flexWrap="wrap" rowGap={2.5} columnGap={5}>
          {colors.map(currentColor => (
            <DefaultColor
              key={currentColor.label}
              onClick={handleAppTheme}
              isDefaultColor={color === currentColor.themeColor}
              {...currentColor}
            />
          ))}
        </Box>
      </Box>
    </section>
  );
};

export default DefaultColors;
