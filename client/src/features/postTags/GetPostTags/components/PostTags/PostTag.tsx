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
  skipOnChange: React.MutableRefObject<boolean>;
  isChecked: boolean;
  dispatch: React.Dispatch<PostTagsListAction>;
  onShiftPlusClick: (shiftKey: boolean, index: number, id: string) => void;
}

const PostTag = ({
  id,
  name,
  index,
  isChecked,
  skipOnChange,
  onShiftPlusClick,
  dispatch,
}: PostTagProps) => {
  const idName = name.replace(/[\s_.]/g, "-");
  const skipOnChangeRef = skipOnChange;

  const handleChange = (checked: boolean) => {
    if (skipOnChangeRef.current) {
      skipOnChangeRef.current = false;
    } else {
      dispatch({ type: "SELECT_POST_TAG", payload: { checked, id, name } });
    }
  };

  return (
    <ListItem
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
          onClick={e => onShiftPlusClick(e.shiftKey, index, id)}
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
              borderColor: isChecked ? "inherit" : "divider",
              ...(isChecked && { bgcolor: "action.selected" }),
              overflow: "hidden",
              whiteSpace: "nowrap",
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
