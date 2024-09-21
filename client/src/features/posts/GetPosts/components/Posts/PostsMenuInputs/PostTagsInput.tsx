import * as React from "react";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { useGetCachedPostTags } from "@hooks/getPostTags/useGetCachedPostTags";
// import type { FiltersHandler } from "@types";

interface PostTagsInputProps {
  postTag: string | undefined;
  // onChange: FiltersHandler;
}

const PostTagsInput = ({ postTag }: PostTagsInputProps) => {
  const postTags = useGetCachedPostTags();

  const postTagsOptions = React.useMemo(() => {
    const options: React.ReactElement[] = [];

    postTags?.forEach(({ id, name }) => {
      options.push(
        <MenuItem key={id} value={name}>
          <Box
            component="span"
            width="100%"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {name}
          </Box>
        </MenuItem>
      );
    });

    return options;
  }, [postTags]);

  return (
    <TextField
      select
      id="post-tags-combobox"
      label="Post Tag"
      size="small"
      value={postTag || ""}
      SelectProps={{
        labelId: "post-tags-input-label",
        MenuProps: { PaperProps: { style: { maxHeight: 300 } } },
      }}
      InputLabelProps={{
        id: "post-tags-input-label",
        htmlFor: "post-tags-input",
      }}
      InputProps={{ id: "post-tags-input" }}
      // onChange={e => onChange("postTag", e.target.value)}
    >
      {postTagsOptions}
    </TextField>
  );
};

export default PostTagsInput;
