import * as React from "react";

import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UnpublishedIcon from "@mui/icons-material/Unpublished";

import NextLink from "@components/ui/NextLink";
import type { PostStatus } from "@apiTypes";
import type { FunctionLike, SxPropsArray } from "@types";

interface PostMenuProps {
  title: string;
  status: PostStatus;
  slug: string;
  disableUnpublish: boolean;
  menuSx?: IconButtonProps["sx"];
  onUnpublish: () => void;
  onBinPost: () => void;
}

const PostMenu = (props: PostMenuProps) => {
  const { title, status, slug, menuSx = [], onUnpublish, onBinPost } = props;
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);
  const isOpen = !!anchor;
  const sxProps: SxPropsArray = Array.isArray(menuSx) ? menuSx : [menuSx];

  const handlerFn = (callback: FunctionLike) => {
    setAnchor(null);
    void callback();
  };

  return (
    <>
      <IconButton
        id={`${slug}-post-action-btn`}
        size="small"
        aria-label={`${title} post actions`}
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
          <MenuItem
            disabled={props.disableUnpublish}
            sx={{ columnGap: 3 }}
            onClick={() => handlerFn(onUnpublish)}
          >
            <UnpublishedIcon fontSize="small" /> Unpublish
          </MenuItem>
        )}
        <MenuItem
          component={NextLink}
          href={`/posts/edit/${slug}`}
          sx={{
            fontStyle: "normal",
            columnGap: 3,
            ...(status === "Published" && {
              borderTop: "1px solid",
              borderTopColor: "divider",
            }),
          }}
        >
          <ModeEditIcon fontSize="small" />{" "}
          {status === "Draft" ? "Continue writing post" : "Edit"}
        </MenuItem>
        <MenuItem
          sx={{ columnGap: 3, color: "error.main" }}
          aria-haspopup="dialog"
          onClick={() => handlerFn(onBinPost)}
        >
          <DeleteIcon color="error" fontSize="small" /> Send to bin
        </MenuItem>
      </Menu>
    </>
  );
};

export default PostMenu;
