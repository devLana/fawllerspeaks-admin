import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import type { GetPostsListAction, PostsView } from "types/posts/getPosts";

interface ToolbarViewButtonsProps {
  postsView: PostsView;
  dispatch: React.Dispatch<GetPostsListAction>;
}

const ToolbarViewButtons = (props: ToolbarViewButtonsProps) => {
  const { postsView, dispatch } = props;
  const view = postsView === "grid" ? "list" : "grid";

  const handleXsView = () => {
    dispatch({ type: "CHANGE_POST_LIST_VIEW", payload: { view } });
  };

  const handleSmView = (nextView: PostsView) => {
    dispatch({ type: "CHANGE_POST_LIST_VIEW", payload: { view: nextView } });
  };

  return (
    <Box sx={{ ml: "auto" }}>
      <Tooltip title={`Switch to ${view} view`} placement="bottom">
        <Button
          size="small"
          onClick={handleXsView}
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
        sx={({ breakpoints: { down } }) => ({
          [down("sm")]: { display: "none" },
        })}
      >
        <Tooltip title="Switch to list view" placement="bottom">
          <Button
            variant={postsView === "list" ? "contained" : "outlined"}
            onClick={() => handleSmView("list")}
          >
            <ViewListRoundedIcon fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title="Switch to grid view" placement="bottom">
          <Button
            variant={postsView === "grid" ? "contained" : "outlined"}
            onClick={() => handleSmView("grid")}
          >
            <GridViewRoundedIcon fontSize="small" />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default ToolbarViewButtons;
