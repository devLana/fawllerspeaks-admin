import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

interface RenderSelectValueProps {
  selected: string[];
  map: Map<string, string>;
}

const RenderSelectedValues = ({ selected, map }: RenderSelectValueProps) => (
  <Box display="flex" flexWrap="wrap" gap={0.5}>
    {selected.map(value => (
      <Chip key={value} label={map.get(value)} sx={{ maxWidth: "11em" }} />
    ))}
  </Box>
);

export default RenderSelectedValues;
