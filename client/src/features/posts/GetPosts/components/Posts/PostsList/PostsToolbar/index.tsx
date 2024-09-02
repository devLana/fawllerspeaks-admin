import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Toolbar from "@mui/material/Toolbar";

interface PostsToolbarProps {
  onChangeCheckbox: (checked: boolean) => void;
  viewButtons: React.ReactElement;
}

const PostsToolbar = ({ onChangeCheckbox, viewButtons }: PostsToolbarProps) => {
  const label = "Select";
  const buttonText = "Delete All Posts";

  return (
    <Toolbar
      disableGutters
      variant="dense"
      sx={{
        mt: 5,
        mb: 1.5,
        borderBottom: "1px solid",
        borderBottomColor: "divider",
        columnGap: 2,
      }}
    >
      <Checkbox
        id="all-posts-checkbox"
        size="small"
        inputProps={{ "aria-label": `${label} all post tags` }}
        onChange={e => onChangeCheckbox(e.target.checked)}
        // checked={numSelected === numTags}
        // indeterminate={isIndeterminate}
      />
      {/* {numSelected > 0 && ( */}
      <Button
        color="error"
        // onClick={() => dispatch({ type: "OPEN_MULTI_DELETE" })}
      >
        {buttonText}
      </Button>
      {/* )} */}
      {viewButtons}
    </Toolbar>
  );
};

export default PostsToolbar;
