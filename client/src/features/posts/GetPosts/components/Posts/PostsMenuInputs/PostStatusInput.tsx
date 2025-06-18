import { useRouter } from "next/router";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import type { PostStatus } from "@apiTypes";
import type { PostsQueryParams } from "types/posts/getPosts";

type Statuses = "All" | PostStatus;
type LowerStatus = Lowercase<Statuses>;
type Query = Pick<PostsQueryParams, "sort" | "status">;

const options: Statuses[] = ["All", "Draft", "Published", "Unpublished"];

const PostStatusInput = () => {
  const { push } = useRouter();
  const { queryParams } = usePostsFilters();

  const handleChange = (statusValue: LowerStatus) => {
    const query: Query = {};

    if (statusValue !== "all") {
      query.status = statusValue;
    }

    if (queryParams.sort) {
      query.sort = queryParams.sort;
    }

    void push({ pathname: "/posts", query });
  };

  return (
    <TextField
      fullWidth
      select
      id="post-status-combobox"
      label="Post Status"
      size="small"
      value={queryParams.status || "all"}
      SelectProps={{ labelId: "post-status-input-label" }}
      InputLabelProps={{
        id: "post-status-input-label",
        htmlFor: "post-status-input",
      }}
      InputProps={{ id: "post-status-input" }}
      onChange={e => handleChange(e.target.value as LowerStatus)}
    >
      {options.map(option => (
        <MenuItem key={option} value={option.toLowerCase()}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default PostStatusInput;
