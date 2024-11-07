import useSelectAllCheckbox from "@hooks/useSelectAllCheckbox";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Toolbar from "@mui/material/Toolbar";

interface PostTagsToolbarProps {
  totalNumberOfPostTags: number;
  numberOfSelectedPostTags: number;
  handleAllCheckboxChange: (checked: boolean) => void;
  handleDelete: () => void;
}

const PostTagsToolbar = ({
  totalNumberOfPostTags: numberTags,
  numberOfSelectedPostTags: numberSelected,
  handleAllCheckboxChange,
  handleDelete,
}: PostTagsToolbarProps) => {
  const checkboxRef = useSelectAllCheckbox(numberSelected, numberTags);

  const label = numberSelected === numberTags ? "Unselect" : "Select";
  let buttonText: string;

  if (numberSelected === numberTags) {
    buttonText = "Delete All Post Tags";
  } else if (numberSelected === 1) {
    buttonText = "Delete Post Tag";
  } else {
    buttonText = `Delete ${numberSelected} Post Tags`;
  }

  return (
    <Toolbar disableGutters sx={{ ml: -1.375 }} variant="dense">
      <Checkbox
        inputRef={checkboxRef}
        id="all-post-tags-checkbox"
        size="small"
        inputProps={{ "aria-label": `${label} all post tags` }}
        onChange={e => handleAllCheckboxChange(e.target.checked)}
        checked={numberSelected === numberTags}
        indeterminate={!(numberSelected === 0 || numberSelected === numberTags)}
      />
      {numberSelected > 0 && (
        <Button color="error" onClick={handleDelete} sx={{ ml: 2 }}>
          {buttonText}
        </Button>
      )}
    </Toolbar>
  );
};

export default PostTagsToolbar;
