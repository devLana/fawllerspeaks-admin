import * as React from "react";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import type { PostTagsListAction } from "types/postTags/getPostTags";

type ActionType = "OPEN_MENU_EDIT" | "OPEN_MENU_DELETE";

interface PostTagMenuProps {
  id: string;
  name: string;
  idName: string;
  dispatch: React.Dispatch<PostTagsListAction>;
}

const PostTagMenu = ({ id, name, idName, dispatch }: PostTagMenuProps) => {
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);

  const handleAction = (type: ActionType) => () => {
    dispatch({ type, payload: { name, id } });
    setAnchor(null);
  };

  const isOpen = !!anchor;

  return (
    <>
      <IconButton
        id={`${idName}-post-tag-btn`}
        size="small"
        aria-label={`${name} post tag`}
        aria-controls={isOpen ? `${idName}-post-tag-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen || undefined}
        onClick={e => setAnchor(e.currentTarget)}
        sx={{
          opacity: 0,
          transition({ transitions: { create, easing } }) {
            return create("opacity", { easing: easing.easeInOut });
          },
          "&:focus": { opacity: 1 },
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`${idName}-post-tag-menu`}
        open={isOpen}
        anchorEl={anchor}
        MenuListProps={{ "aria-labelledby": `${idName}-post-tag-btn` }}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          dense
          sx={{ columnGap: 3 }}
          aria-haspopup="dialog"
          onClick={handleAction("OPEN_MENU_EDIT")}
        >
          <ModeEditIcon fontSize="small" /> Edit
        </MenuItem>
        <MenuItem
          dense
          sx={{ columnGap: 3, color: "error.main" }}
          aria-haspopup="dialog"
          onClick={handleAction("OPEN_MENU_DELETE")}
        >
          <DeleteForeverRoundedIcon color="error" fontSize="small" /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default React.memo(PostTagMenu);
