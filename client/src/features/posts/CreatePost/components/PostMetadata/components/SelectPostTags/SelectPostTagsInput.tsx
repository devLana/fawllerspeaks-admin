import * as React from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { useGetCachePostTags } from "@hooks/useGetCachePostTags";
import RenderSelectedPostTags from "./RenderSelectedPostTags";
import type { CreatePostAction } from "@types";

interface SelectPostTagsInputProps {
  tags?: string[];
  dispatch?: React.Dispatch<CreatePostAction>;
}

const SelectPostTagsInput = (props: SelectPostTagsInputProps) => {
  const { tags = [], dispatch } = props;

  const postTags = useGetCachePostTags();

  const postTagsMap = React.useMemo(() => {
    const map = new Map<string, string>();
    const options: React.ReactElement[] = [];

    postTags?.forEach(({ id, name }) => {
      map.set(id, name);
      options.push(
        <MenuItem key={id} value={id}>
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

    return { map, options };
  }, [postTags]);

  const handleChange = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    const selectedTags = typeof value === "string" ? value.split(",") : value;

    dispatch?.({ type: "SELECT_POST_TAGS", payload: { tags: selectedTags } });
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="post-tags-label" htmlFor="post-tags-input">
        Post Tags
      </InputLabel>
      <Select
        labelId="post-tags-label"
        id="post-tags"
        multiple
        value={tags}
        onChange={handleChange}
        input={<OutlinedInput id="post-tags-input" label="Post Tags" />}
        renderValue={selected => (
          <RenderSelectedPostTags selected={selected} map={postTagsMap.map} />
        )}
        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
      >
        {postTagsMap.options}
      </Select>
    </FormControl>
  );
};

export default SelectPostTagsInput;
