import * as React from "react";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { DraftErrorCb, FunctionLike, CreateStatus } from "@types";

interface PostPreviewActionsMenuProps {
  draftStatus: CreateStatus;
  onCreate: () => void;
  onDraft: (errorCb?: DraftErrorCb) => Promise<void>;
}

const PostPreviewActionsMenu = (props: PostPreviewActionsMenuProps) => {
  const { draftStatus, onDraft, onCreate } = props;
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);

  const handler = (callback: FunctionLike) => {
    setAnchor(null);
    void callback();
  };

  const isOpen = !!anchor;

  return (
    <>
      <IconButton
        disabled={draftStatus === "loading"}
        id="post-preview-actions-btn"
        size="small"
        color="secondary"
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => handler(onCreate)}
          dense
          aria-haspopup="dialog"
        >
          Create Post
        </MenuItem>
        <MenuItem onClick={() => handler(onDraft)} dense>
          Save Post As Draft
        </MenuItem>
      </Menu>
    </>
  );
};

export default PostPreviewActionsMenu;