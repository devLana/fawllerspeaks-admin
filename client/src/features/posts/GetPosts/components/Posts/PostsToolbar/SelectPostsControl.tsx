import * as React from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import useSelectAllCheckbox from "@hooks/useSelectAllCheckbox";
import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import type * as types from "types/posts/getPosts";
import type { PostStatus } from "@apiTypes";

interface SelectPostsControlProps {
  pagePostsSelected: number;
  posts: types.PostsPagePostData[];
  dispatch: React.Dispatch<types.GetPostsListAction>;
}

const SelectPostsControl = (props: SelectPostsControlProps) => {
  const { pagePostsSelected, posts, dispatch } = props;
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);

  const checkboxRef = useSelectAllCheckbox(pagePostsSelected, posts.length);
  const { queryParams } = usePostsFilters();

  const allSelected = pagePostsSelected === posts.length;

  const handler = (status: PostStatus | "none") => {
    setAnchor(null);
    dispatch({ type: "SELECT_POSTS_BY_STATUS", payload: { posts, status } });
  };

  const handleSelect = () => {
    dispatch({ type: "TOGGLE_ALL_POSTS_SELECT", payload: { posts } });
  };

  return (
    <>
      <Tooltip placement="bottom" title="Select">
        <Box
          sx={{
            ml: 0.75,
            display: "flex",
            borderRadius: 1,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Checkbox
            inputRef={checkboxRef}
            id="all-posts-checkbox"
            size="small"
            inputProps={{
              "aria-label": `${allSelected ? "Unselect" : "Select"} all posts`,
            }}
            onChange={handleSelect}
            checked={allSelected}
            indeterminate={
              !(pagePostsSelected === 0 || pagePostsSelected === posts.length)
            }
            sx={({ shape }) => ({
              borderRadius: !queryParams.status ? 0 : 1,
              borderTopLeftRadius: `${shape.borderRadius}px`,
              borderBottomLeftRadius: `${shape.borderRadius}px`,
            })}
          />
          {!queryParams.status && (
            <IconButton
              id="select-posts-menu-btn"
              aria-label="Select or Unselect all posts on the page by status"
              aria-controls={anchor ? "select-posts-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={!!anchor || undefined}
              onClick={e => setAnchor(e.currentTarget)}
              disableTouchRipple
              disableFocusRipple
              color="inherit"
              sx={({ shape }) => ({
                p: 0,
                borderRadius: 0,
                borderTopRightRadius: `${shape.borderRadius}px`,
                borderBottomRightRadius: `${shape.borderRadius}px`,
              })}
            >
              <ArrowDropDownIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Tooltip>
      {!queryParams.status && (
        <Menu
          id="select-posts-menu"
          open={!!anchor}
          anchorEl={anchor}
          MenuListProps={{ "aria-labelledby": "select-posts-menu-btn" }}
          onClose={() => setAnchor(null)}
        >
          <MenuItem onClick={() => handler("none")}>None</MenuItem>
          <MenuItem onClick={() => handler("Draft")}>Draft</MenuItem>
          <MenuItem onClick={() => handler("Published")}>Published</MenuItem>
          <MenuItem onClick={() => handler("Unpublished")}>
            Unpublished
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default SelectPostsControl;
