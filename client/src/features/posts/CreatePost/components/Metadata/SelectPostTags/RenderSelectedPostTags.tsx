import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";

interface RenderSelectValueProps {
  selected: string[];
  map: Record<string, string>;
}

const RenderSelectedValues = ({ selected, map }: RenderSelectValueProps) => (
  <List
    disablePadding
    sx={{ display: "flex", flexWrap: "wrap", rowGap: 1, columnGap: 0.5 }}
    aria-label="selected post tags"
  >
    {selected.map(value => (
      <ListItem disablePadding key={value} sx={{ width: "auto" }}>
        <Chip label={map[value]} sx={{ maxWidth: "15em" }} />
      </ListItem>
    ))}
  </List>
);

export default RenderSelectedValues;
