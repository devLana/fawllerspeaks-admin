import { useRouter } from "next/router";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import type { PostsQueryParams } from "types/posts/getPosts";

type Query = Pick<PostsQueryParams, "size" | "sort" | "status">;

const options = [6, 12, 18, 24, 30];

const PageSizeInput = () => {
  const { push } = useRouter();
  const { queryParams } = usePostsFilters();

  const handleChange = (size: number) => {
    const query: Query = {};
    query.size = size;

    if (queryParams.sort) {
      query.sort = queryParams.sort;
    }

    if (queryParams.status) {
      query.status = queryParams.status;
    }

    void push({ pathname: "/posts", query });
  };

  return (
    <TextField
      fullWidth
      select
      id="page-size-combobox"
      label="Page Size"
      size="small"
      value={queryParams.size || options[1]}
      SelectProps={{ labelId: "page-size-input-label" }}
      InputLabelProps={{
        id: "page-size-input-label",
        htmlFor: "page-size-input",
      }}
      InputProps={{ id: "page-size-input" }}
      onChange={e => handleChange(+e.target.value)}
    >
      {options.map(option => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default PageSizeInput;
