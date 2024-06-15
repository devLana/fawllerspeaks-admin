import * as React from "react";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface PostPreviewActionsMenuProps {
  onPublish: () => Promise<void>;
  onDraft: () => Promise<void>;
}

const PostPreviewActionsMenu = (props: PostPreviewActionsMenuProps) => {
  const { onDraft, onPublish } = props;
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);

  const isOpen = !!anchor;
  return (
    <>
      <IconButton
        id="post-preview-actions-btn"
        aria-label="Post preview actions menu"
        aria-controls={isOpen ? "post-preview-actions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen || undefined}
        onClick={e => setAnchor(e.currentTarget)}
        sx={({ breakpoints }) => ({
          [breakpoints.down("sm")]: { display: "none" },
          [breakpoints.up("sm")]: { ml: "auto" },
        })}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id="post-preview-actions-menu"
        open={isOpen}
        anchorEl={anchor}
        MenuListProps={{ "aria-labelledby": "post-preview-actions-btn" }}
        onClose={() => setAnchor(null)}
        // anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        // transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={onPublish}
          dense
          // aria-haspopup="dialog"
        >
          Publish Post
        </MenuItem>
        <MenuItem
          onClick={onDraft}
          dense
          // aria-haspopup="dialog"
        >
          Save Post As Draft
        </MenuItem>
      </Menu>
    </>
  );
};

export default PostPreviewActionsMenu;
