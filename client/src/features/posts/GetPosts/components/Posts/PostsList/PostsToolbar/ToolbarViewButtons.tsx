import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import type { PostsView } from "@features/posts/GetPosts/types";

interface ToolbarViewButtonsProps {
  postsView: PostsView;
  onChangePostsViewXs: VoidFunction;
  onChangePostsViewSm: (view: PostsView) => void;
}

const ToolbarViewButtons = (props: ToolbarViewButtonsProps) => {
  const { postsView, onChangePostsViewXs, onChangePostsViewSm } = props;

  const view = postsView === "grid" ? "list" : "grid";

  return (
    <Box sx={{ ml: "auto" }}>
      <Tooltip title={`Switch to ${view} view`} placement="bottom">
        <Button
          onClick={onChangePostsViewXs}
          size="small"
          variant={postsView === "list" ? "contained" : "outlined"}
          sx={({ breakpoints }) => ({
            minWidth: "auto",
            [breakpoints.up("sm")]: { display: "none" },
          })}
        >
          <ViewListRoundedIcon fontSize="small" />
        </Button>
      </Tooltip>
      <ButtonGroup
        size="small"
        aria-label="Posts view button"
        sx={({ breakpoints }) => ({
          [breakpoints.down("sm")]: { display: "none" },
        })}
      >
        <Tooltip title="Switch to list view" placement="bottom">
          <Button
            variant={postsView === "list" ? "contained" : "outlined"}
            onClick={() => onChangePostsViewSm("list")}
          >
            <ViewListRoundedIcon fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title="Switch to grid view" placement="bottom">
          <Button
            variant={postsView === "grid" ? "contained" : "outlined"}
            onClick={() => onChangePostsViewSm("grid")}
          >
            <GridViewRoundedIcon fontSize="small" />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default ToolbarViewButtons;
