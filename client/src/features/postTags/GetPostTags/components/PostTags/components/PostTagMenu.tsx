import * as React from "react";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

interface PostTagMenuProps {
  id: string;
  name: string;
  idName: string;
  onOpenEdit: (tagName: string, tagId: string) => void;
  onOpenDelete: (name: string, id: string) => void;
}

const PostTagMenu = (props: PostTagMenuProps) => {
  const { id, name, idName, onOpenEdit, onOpenDelete } = props;
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);

  const handleAction = (cb: (...args: unknown[]) => void) => () => {
    cb();
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
          transition: ({ transitions: { create, easing } }) => {
            return create("opacity", { easing: easing.easeInOut });
          },
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
          onClick={handleAction(() => onOpenEdit(name, id))}
        >
          <ModeEditIcon fontSize="small" /> Edit
        </MenuItem>
        <MenuItem
          dense
          sx={{ columnGap: 3, color: "error.main" }}
          aria-haspopup="dialog"
          onClick={handleAction(() => onOpenDelete(name, id))}
        >
          <DeleteForeverRoundedIcon color="error" fontSize="small" /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default PostTagMenu;
