import * as React from "react";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface TagMenuProps {
  tagId: string;
  tagName: string;
  onEditPostTag: (tagName: string, tagId: string) => void;
}

const TagMenu = ({ tagId, tagName, onEditPostTag }: TagMenuProps) => {
  const [anchor, setAnchor] = React.useState<null | HTMLButtonElement>(null);

  const handleClick = (name: string, id: string) => {
    onEditPostTag(name, id);
    setAnchor(null);
  };

  const isOpen = !!anchor;
  const idName = tagName.replace(" ", "-");

  return (
    <>
      <IconButton
        id={`${idName}-post-tag-btn`}
        size="small"
        aria-label={`${tagName} post tag`}
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
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem
          sx={{ columnGap: 3 }}
          aria-haspopup="dialog"
          onClick={() => handleClick(tagName, tagId)}
        >
          <ModeEditIcon fontSize="small" /> Edit
        </MenuItem>
      </Menu>
    </>
  );
};
export default TagMenu;
