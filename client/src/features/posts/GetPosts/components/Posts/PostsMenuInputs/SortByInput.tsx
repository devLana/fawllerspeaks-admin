import { useRouter } from "next/router";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import type { SortPostsBy } from "@apiTypes";
import type { PostsQueryParams } from "types/posts/getPosts";

type Query = Pick<PostsQueryParams, "sort" | "status">;

const options: { label: string; value: SortPostsBy }[] = [
  { label: "Date", value: "date_asc" },
  { label: "Title", value: "title_asc" },
  { label: "Date (Desc)", value: "date_desc" },
  { label: "Title (Desc)", value: "title_desc" },
];

const SortByInput = () => {
  const { push } = useRouter();
  const { queryParams } = usePostsFilters();

  const handleChange = (postSortOrder: SortPostsBy) => {
    const query: Query = {};
    query.sort = postSortOrder;

    if (queryParams.status) {
      query.status = queryParams.status;
    }

    void push({ pathname: "/posts", query });
  };

  return (
    <TextField
      fullWidth
      select
      id="sort-by-combobox"
      label="Sort By"
      size="small"
      value={queryParams.sort || "date_desc"}
      SelectProps={{ labelId: "sort-by-input-label" }}
      InputLabelProps={{ id: "sort-by-input-label", htmlFor: "sort-by-input" }}
      InputProps={{ id: "sort-by-input" }}
      onChange={e => handleChange(e.target.value as SortPostsBy)}
    >
      {options.map(({ label, value }) => (
        <MenuItem key={label} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SortByInput;
