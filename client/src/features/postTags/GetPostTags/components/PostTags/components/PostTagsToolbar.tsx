import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Toolbar from "@mui/material/Toolbar";
import type { PostTagsListAction } from "@types";

interface PostTagsToolbarProps {
  totalNumberOfPostTags: number;
  numberOfSelectedPostTags: number;
  onAllCheckboxChange: (checked: boolean) => void;
  dispatch: React.Dispatch<PostTagsListAction>;
}

const PostTagsToolbar = ({
  totalNumberOfPostTags: numTags,
  numberOfSelectedPostTags: numSelected,
  onAllCheckboxChange,
  dispatch,
}: PostTagsToolbarProps) => {
  const label = numSelected === numTags ? "Unselect" : "Select";
  let buttonText: string;
  let isIndeterminate: boolean;

  if (numSelected === numTags) {
    buttonText = "Delete All Post Tags";
  } else if (numSelected === 1) {
    buttonText = "Delete 1 Post Tag";
  } else {
    buttonText = `Delete ${numSelected} Post Tags`;
  }

  if (numSelected === 0 || numSelected === numTags) {
    isIndeterminate = false;
  } else {
    isIndeterminate = true;
  }

  return (
    <Toolbar disableGutters sx={{ ml: -1.375 }} variant="dense">
      <Checkbox
        id="all-post-tags-checkbox"
        size="small"
        inputProps={{ "aria-label": `${label} all post tags` }}
        onChange={e => onAllCheckboxChange(e.target.checked)}
        checked={numSelected === numTags}
        indeterminate={isIndeterminate}
      />
      {numSelected > 0 && (
        <Button
          color="error"
          onClick={() => dispatch({ type: "OPEN_MULTI_DELETE" })}
          sx={{ ml: 2 }}
        >
          {buttonText}
        </Button>
      )}
    </Toolbar>
  );
};

export default PostTagsToolbar;
