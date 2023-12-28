import * as React from "react";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";

import { usePostTagsListDispatch } from "@features/postTags/context/PostTagsListDispatchContext";
import PostTagMenu from "./PostTagMenu";

interface PostTagProps {
  id: string;
  name: string;
  isChecked: boolean;
  onClickLabel: (shiftKey: boolean, id: string) => void;
}

const PostTag = ({ id, name, isChecked, onClickLabel }: PostTagProps) => {
  const idName = name.replace(/[\s_.]/g, "-");
  const dispatch = usePostTagsListDispatch();

  const handleChange = (checked: boolean) => {
    dispatch({ type: "CLICK_POST_TAG", payload: { checked, id, name } });
  };

  return (
    <Grid component={ListItem} disableGutters item xs={6} md={4} lg={3}>
      <Stack
        aria-label={`${name} post tag container`}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        columnGap={1}
        width="100%"
        sx={{ "&:hover>.MuiIconButton-root": { opacity: 1 } }}
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
          sx={theme => ({
            mr: 0,
            width: "75%",
            columnGap: 0.25,
            flex: 0,
            [theme.breakpoints.up("md")]: { width: "80%" },
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
          })}
        />
        <PostTagMenu id={id} name={name} idName={idName} />
      </Stack>
    </Grid>
  );
};

export default React.memo(PostTag);
