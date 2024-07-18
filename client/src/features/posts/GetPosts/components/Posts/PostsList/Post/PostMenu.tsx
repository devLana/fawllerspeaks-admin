import * as React from "react";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/Unpublished";

import type { PostStatus } from "@apiTypes";

interface PostMenuProps {
  name: string;
  idName: string;
  status: PostStatus;
}

const PostMenu = ({ idName, name, status }: PostMenuProps) => {
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);

  const isOpen = !!anchor;

  return (
    <>
      <IconButton
        id={`${idName}-post-action-btn`}
        size="small"
        aria-label={`${name} blog post`}
        aria-controls={isOpen ? `${idName}-post-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen || undefined}
        onClick={e => setAnchor(e.currentTarget)}
        color="secondary"
        sx={{ position: "absolute", top: "3px", left: "3px" }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id={`${idName}-post-menu`}
        open={isOpen}
        anchorEl={anchor}
        MenuListProps={{ "aria-labelledby": `${idName}-post-action-btn` }}
        onClose={() => setAnchor(null)}
      >
        {status === "Published" && (
          <MenuItem sx={{ columnGap: 3 }}>
            <UnpublishedIcon fontSize="small" /> Unpublish
          </MenuItem>
        )}
        {status === "Unpublished" && (
          <MenuItem sx={{ columnGap: 3 }}>
            <PublishIcon fontSize="small" /> Publish
          </MenuItem>
        )}
        <MenuItem
          sx={{
            columnGap: 3,
            ...(status !== "Draft" && {
              borderTop: "1px solid",
              borderTopColor: "divider",
            }),
          }}
        >
          <ModeEditIcon fontSize="small" /> Edit
        </MenuItem>
        <MenuItem
          sx={{ columnGap: 3, color: "error.main" }}
          aria-haspopup="dialog"
        >
          <DeleteIcon color="error" fontSize="small" /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default PostMenu;
