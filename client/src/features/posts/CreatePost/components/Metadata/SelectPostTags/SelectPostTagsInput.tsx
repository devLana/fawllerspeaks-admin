import * as React from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { useGetCachedPostTags } from "@hooks/getPostTags/useGetCachedPostTags";
import TooltipHint from "../TooltipHint";
import RenderSelectedPostTags from "./RenderSelectedPostTags";
import type { CreatePostAction } from "types/posts/createPost";

interface SelectPostTagsInputProps {
  tagIdsError: string | undefined;
  tagIds: string[] | undefined;
  dispatch: React.Dispatch<CreatePostAction>;
}

const SelectPostTagsInput = (props: SelectPostTagsInputProps) => {
  const { tagIdsError, tagIds = [], dispatch } = props;
  const postTags = useGetCachedPostTags();

  const postTagsMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    const options: React.ReactElement[] = [];

    postTags?.forEach(({ id, name }) => {
      map[id] = name;

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

    dispatch({ type: "MANAGE_POST_TAGS", payload: { tagIds: selectedTags } });
  };

  const ariaId = tagIdsError ? "post-tags-error-message" : undefined;

  return (
    <TooltipHint
      hint="An optional collection of labels used to categorize the post. Select as much as needed"
      addAriaBusy
    >
      <FormControl fullWidth error={!!tagIdsError}>
        <InputLabel id="post-tags-label" htmlFor="post-tags-input">
          Post Tags
        </InputLabel>
        <Select
          labelId="post-tags-label"
          id="post-tags"
          multiple
          value={tagIds}
          onChange={handleChange}
          input={<OutlinedInput id="post-tags-input" label="Post Tags" />}
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          SelectDisplayProps={{
            "aria-describedby": ariaId,
            "aria-errormessage": ariaId,
            "aria-invalid": !!tagIdsError,
          }}
          renderValue={selected => (
            <RenderSelectedPostTags selected={selected} map={postTagsMap.map} />
          )}
        >
          {postTagsMap.options}
        </Select>
        {tagIdsError && (
          <FormHelperText id="post-tags-error-message">
            {tagIdsError}
          </FormHelperText>
        )}
      </FormControl>
    </TooltipHint>
  );
};

export default SelectPostTagsInput;
