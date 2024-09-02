import * as React from "react";
import { useRouter } from "next/router";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { usePostsFilters } from "@features/posts/GetPosts/hooks/usePostsFilters";
import type { SortPostsBy } from "@apiTypes";

const options: { label: string; value: SortPostsBy }[] = [
  { label: "Date Created", value: "date_asc" },
  { label: "Date Created (Desc)", value: "date_desc" },
  { label: "Title", value: "title_asc" },
  { label: "Title (Desc)", value: "title_desc" },
];

const SortByInput = () => {
  const { push } = useRouter();
  const { queryParams } = usePostsFilters();
  const { sort, status } = queryParams;
  const [sortOrder, setSortOrder] = React.useState(sort || "");

  React.useEffect(() => {
    setSortOrder(sort || "");
  }, [sort]);

  const handleChange = (postSortOrder: SortPostsBy) => {
    setSortOrder(postSortOrder);

    void push({
      pathname: "/posts",
      query: { ...(status && { status }), sort: postSortOrder },
    });
  };

  return (
    <TextField
      fullWidth
      select
      id="sort-by-combobox"
      label="Sort By"
      size="small"
      value={sortOrder}
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
