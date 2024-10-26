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
  index: number;
  isChecked: boolean;
  dispatch: React.Dispatch<PostTagsListAction>;
  onClickLabel: (shiftKey: boolean, index: number, id: string) => void;
}

const PostTag = (props: PostTagProps) => {
  const { id, name, index, isChecked, onClickLabel, dispatch } = props;
  const idName = name.replace(/[\s_.]/g, "-");

  const handleChange = (checked: boolean) => {
    dispatch({ type: "SELECT_POST_TAG", payload: { checked, id, name } });
  };

  return (
    <ListItem
      aria-label={`${name} post tag`}
      disablePadding
      sx={{ "&:hover>div>.MuiIconButton-root": { opacity: 1 } }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 1,
          width: "100%",
        }}
      >
        <FormControlLabel
          onClick={e => onClickLabel(e.shiftKey, index, id)}
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
