import * as React from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ListItem from "@mui/material/ListItem";

import PostTagMenu from "./PostTagMenu";
import type { PostTagsListAction } from "types/postTags/getPostTags";

interface PostTagProps {
  id: string;
  name: string;
  isChecked: boolean;
  dispatch: React.Dispatch<PostTagsListAction>;
  onClickLabel: (shiftKey: boolean, id: string) => void;
}

const PostTag = (props: PostTagProps) => {
  const { id, name, isChecked, onClickLabel, dispatch } = props;
  const idName = name.replace(/[\s_.]/g, "-");

  const handleChange = (checked: boolean) => {
    dispatch({ type: "CLICK_POST_TAG", payload: { checked, id, name } });
  };

  return (
    <ListItem disablePadding>
      <Box
        aria-label={`${name} post tag container`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 1,
          width: "100%",
          "&:hover>.MuiIconButton-root": { opacity: 1 },
        }}
      >
        <FormControlLabel
          onClick={e => onClickLabel(e.shiftKey, id)}
          control={
            <Checkbox
              id={`${idName}-checkbox`}
              size="small"
              onChange={e => handleChange(e.target.checked)}
              checked={isChecked}
            />
          }
          label={name}
          sx={{
            mr: 0,
            width: "calc(100% - 40px)",
            columnGap: 1,
            flex: 0,
            "&>.MuiFormControlLabel-label": {
              textOverflow: "ellipsis",
              lineHeight: 1,
              fontSize: "0.85em",
              p: 1.25,
              borderRadius: 3,
              border: 1,
              borderColor: isChecked ? "inherit" : "transparent",
              overflow: "hidden",
              whiteSpace: "nowrap",
              bgcolor: "action.selected",
              userSelect: "none",
            },
          }}
        />
        <PostTagMenu id={id} name={name} idName={idName} dispatch={dispatch} />
      </Box>
    </ListItem>
  );
};

export default React.memo(PostTag);
