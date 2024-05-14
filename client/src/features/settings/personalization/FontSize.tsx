import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import { useAppTheme } from "@context/AppTheme";

const FontSize = ({ fontSize }: { fontSize: number }) => {
  const handleAppTheme = useAppTheme();

  return (
    <Box component="section" mb={5}>
      <Typography variant="h2" gutterBottom>
        Font Size
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        columnGap={2.5}
        p={2}
        px={{ sm: 1.5 }}
        bgcolor="action.disabledBackground"
        borderRadius={1}
      >
        <Typography variant="caption" fontSize={13}>
          Aa
        </Typography>
        <Slider
          aria-label="change font size"
          getAriaValueText={value => `font size ${value}`}
          min={14}
          max={18}
          marks
          value={fontSize}
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
      </Box>
    </Box>
  );
};

export default FontSize;
