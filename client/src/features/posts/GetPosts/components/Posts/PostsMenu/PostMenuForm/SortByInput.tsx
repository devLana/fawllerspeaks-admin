import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import type { PostsQueryParamsHandler } from "@types";

interface SortByInputProps {
  sortBy: string | undefined;
  onChange: PostsQueryParamsHandler;
}

const options = [
  { label: "Title", value: "title:asc" },
  { label: "Date Created", value: "created:asc" },
  { label: "Date Published", value: "published:asc" },
  { label: "Views", value: "views:asc" },
  { label: "Title(Desc)", value: "title:desc" },
  { label: "Date Created(Desc)", value: "created:desc" },
  { label: "Date Published(Desc)", value: "published:desc" },
  { label: "Views(Desc)", value: "views:desc" },
];

const SortByInput = ({ sortBy, onChange }: SortByInputProps) => (
  <TextField
    select
    id="sort-by-combobox"
    label="Sort By"
    size="small"
    value={sortBy || ""}
    SelectProps={{
      labelId: "sort-by-input-label",
    }}
    InputLabelProps={{ id: "sort-by-input-label", htmlFor: "sort-by-input" }}
    InputProps={{ id: "sort-by-input" }}
    onChange={e => onChange("sort", e.target.value)}
  >
    {options.map(({ label, value }) => (
      <MenuItem key={label} value={value}>
        {label}
      </MenuItem>
    ))}
  </TextField>
);

export default SortByInput;
