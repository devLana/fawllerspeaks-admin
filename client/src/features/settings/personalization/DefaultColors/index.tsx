import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/MUIThemeContext";
import DefaultColor from "./DefaultColor";

const colors = [
  { label: "Blue", hexCode: "#7dd1f3" },
  { label: "Gray", hexCode: "#6a6a6a" },
] as const;

const DefaultColors = () => {
  const handleAppTheme = useAppTheme();

  return (
    <Box component="section">
      <Typography variant={"h2"} gutterBottom fontSize="16px">
        Default Color
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
          sx={{ rowGap: 2.5, columnGap: 7 }}
          justifyContent={{ sm: "flex-start" }}
        >
          {colors.map(color => (
            <DefaultColor
              key={color.label}
              onClick={handleAppTheme}
              {...color}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default DefaultColors;
