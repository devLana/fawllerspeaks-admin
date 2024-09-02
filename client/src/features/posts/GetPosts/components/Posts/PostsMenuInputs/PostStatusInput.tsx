import * as React from "react";
import { useRouter } from "next/router";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { usePostsFilters } from "@features/posts/GetPosts/hooks/usePostsFilters";
import type { PostStatus } from "@apiTypes";

type Statuses = "All" | PostStatus;
type Lower = Lowercase<Statuses>;

const options: Statuses[] = ["All", "Draft", "Published", "Unpublished"];

const PostStatusInput = () => {
  const { push } = useRouter();
  const { queryParams } = usePostsFilters();
  const { sort, status } = queryParams;
  const [postStatus, setPostStatus] = React.useState(status || "");

  React.useEffect(() => {
    setPostStatus(status || "");
  }, [status]);

  const handleChange = (statusValue: Lower) => {
    setPostStatus(statusValue);

    void push({
      pathname: "/posts",
      query: {
        ...(statusValue !== "all" && { status: statusValue }),
        ...(sort && { sort }),
      },
    });
  };

  return (
    <TextField
      fullWidth
      select
      id="post-status-combobox"
      label="Post Status"
      size="small"
      value={postStatus}
      SelectProps={{ labelId: "post-status-input-label" }}
      InputLabelProps={{
        id: "post-status-input-label",
        htmlFor: "post-status-input",
      }}
      InputProps={{ id: "post-status-input" }}
      onChange={e => handleChange(e.target.value as Lower)}
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
