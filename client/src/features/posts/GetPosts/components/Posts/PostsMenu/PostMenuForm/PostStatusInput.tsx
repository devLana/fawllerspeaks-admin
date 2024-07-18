import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import type { PostsQueryParamsHandler } from "@types";
import type { PostStatus } from "@apiTypes";

interface PostStatusInputProps {
  postStatus: Lowercase<PostStatus> | undefined;
  onChange: PostsQueryParamsHandler;
}

const options: PostStatus[] = ["Draft", "Published", "Unpublished"];

const PostStatusInput = ({ postStatus, onChange }: PostStatusInputProps) => (
  <TextField
    select
    id="post-status-combobox"
    label="Post Status"
    size="small"
    value={postStatus || ""}
    SelectProps={{
      labelId: "post-status-input-label",
    }}
    InputLabelProps={{
      id: "post-status-input-label",
      htmlFor: "post-status-input",
    }}
    InputProps={{ id: "post-status-input" }}
    onChange={e => {
      onChange("status", e.target.value as Lowercase<PostStatus>);
    }}
  >
    {options.map(option => (
      <MenuItem key={option} value={option.toLowerCase()}>
        {option}
      </MenuItem>
    ))}
  </TextField>
);

export default PostStatusInput;
