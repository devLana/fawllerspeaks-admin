import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/MUIThemeContext";

const FontSize = () => {
  const { typography } = useTheme();
  const handleAppTheme = useAppTheme();

  return (
    <Box component="section" mb={5}>
      <Typography variant="h2" gutterBottom>
        Font Size
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2.5}
        py={2}
        px={{ xs: 2, sm: 1.5 }}
        bgcolor="action.disabledBackground"
        borderRadius={1}
      >
        <Typography variant="caption" fontSize={13}>
          Aa
        </Typography>
        <Slider
          aria-label="font size"
          getAriaValueText={(value: number) => `font size ${value}`}
          min={14}
          max={18}
          marks
          value={typography.fontSize}
          onChangeCommitted={(_, value) => {
            handleAppTheme("fontSize", value as number);
          }}
          sx={{
            "&>.MuiSlider-mark": { width: "1px", height: "4px" },
            "&>.MuiSlider-mark.MuiSlider-markActive": { height: "6px" },
          }}
        />
        <Typography variant="caption" fontSize={18}>
          Aa
        </Typography>
      </Stack>
    </Box>
  );
};

export default FontSize;
