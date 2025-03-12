import * as React from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectProps } from "@mui/material/Select";
import type { RefCallBack } from "react-hook-form";

import { useGetCachedPostTags } from "@hooks/getPostTags/useGetCachedPostTags";
import TooltipHint from "@features/posts/components/TooltipHint";
import RenderSelectedPostTags from "./RenderSelectedPostTags";

interface Field {
  name: "tagIds";
  ref: RefCallBack;
  onChange: SelectProps["onChange"];
}

interface Controlled extends Field {
  value: string[];
  defaultValue?: never;
}

interface Uncontrolled extends Field {
  defaultValue: string[];
  value?: never;
}

interface PostMetadataPostTagsInputProps {
  tagIdsError: string | undefined;
  field: Controlled | Uncontrolled;
}

const PostMetadataPostTagsInput = (props: PostMetadataPostTagsInputProps) => {
  const { tagIdsError, field } = props;
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

  const { ref, ...selectProps } = field;
  const ariaId = tagIdsError ? "post-tags-error-message" : undefined;

  return (
    <TooltipHint
      hint="Select up to 5 optional labels that will be used to categorize this post"
      addAriaBusy
    >
      <FormControl fullWidth error={!!tagIdsError}>
        <InputLabel id="post-tags-label" htmlFor="post-tags-input">
          Post Tags
        </InputLabel>
        <Select
          {...selectProps}
          labelId="post-tags-label"
          id="post-tags"
          multiple
          inputRef={ref}
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

export default PostMetadataPostTagsInput;
