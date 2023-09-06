import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/MUIThemeContext";

const formatValue = (value: number) => `${value}px`;

const FontSize = () => {
  const { typography } = useTheme();
  const handleAppTheme = useAppTheme();

  const handleChange = (value: number) => {
    handleAppTheme("fontSize", value);
  };

  return (
    <Box sx={{ mb: 5 }} component="section">
      <Typography variant={"h2"} gutterBottom fontSize="16px">
        Font Size
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2.5}
        sx={{
          py: 2,
          px: { xs: 2, sm: 1.5 },
          bgcolor: "action.disabledBackground",
          borderRadius: 1,
        }}
      >
        <Typography variant="caption" fontSize={13}>
          Aa
        </Typography>
        <Slider
          aria-label="font size"
          getAriaValueText={formatValue}
          valueLabelFormat={formatValue}
          valueLabelDisplay="auto"
          step={2}
          min={14}
          max={24}
          marks
          value={typography.fontSize}
          onChangeCommitted={(_, value) => handleChange(value as number)}
          sx={{
            "&>.MuiSlider-mark": { width: "1px", height: "4px" },
            "&>.MuiSlider-mark.MuiSlider-markActive": { height: "6px" },
          }}
        />
        <Typography variant="caption" fontSize={16}>
          Aa
        </Typography>
      </Stack>
    </Box>
  );
};

export default FontSize;
