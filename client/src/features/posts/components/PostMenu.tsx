import * as React from "react";

import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/Unpublished";

import type { PostStatus } from "@apiTypes";
import type { SxPropsArray } from "@types";

interface PostMenuProps {
  title: string;
  status: PostStatus;
  slug: string;
  sx?: IconButtonProps["sx"];
}

const PostMenu = ({ title, status, slug, sx = [] }: PostMenuProps) => {
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);
  const isOpen = !!anchor;
  const sxProps: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <>
      <IconButton
        id={`${slug}-post-action-btn`}
        size="small"
        aria-label={`${title} blog post`}
        aria-controls={isOpen ? `${slug}-post-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen || undefined}
        onClick={e => setAnchor(e.currentTarget)}
        color="secondary"
        sx={[...sxProps]}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id={`${slug}-post-menu`}
        open={isOpen}
        anchorEl={anchor}
        MenuListProps={{ "aria-labelledby": `${slug}-post-action-btn` }}
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
