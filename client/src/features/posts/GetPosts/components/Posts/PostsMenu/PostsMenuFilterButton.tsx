import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClearIcon from "@mui/icons-material/Clear";
import Tooltip from "@mui/material/Tooltip";
import TuneIcon from "@mui/icons-material/Tune";

interface PostsMenuFilterButtonProps {
  onToggleFormVisibility: VoidFunction;
  onClearQueryParams: VoidFunction;
}

const PostsMenuFilterButton = (props: PostsMenuFilterButtonProps) => {
  const { query, push } = useRouter();

  const { onToggleFormVisibility, onClearQueryParams } = props;
  let count = 0;

  if (typeof query.q === "string") count++;
  if (typeof query["post-tag"] === "string") count++;
  if (typeof query.status === "string") count++;
  if (typeof query.sort === "string") count++;

  const handleClearParams = () => {
    void push("/posts");
    onClearQueryParams();
  };

  return (
    <ButtonGroup
      size="large"
      variant="outlined"
      aria-label="Posts menu filters button"
    >
      <Button startIcon={<TuneIcon />} onClick={onToggleFormVisibility}>
        Filters {count > 0 && `(${count})`}
      </Button>
      {count > 0 && (
        <Tooltip title="Clear all filters" placement="bottom">
          <Button
            size="small"
            onClick={handleClearParams}
            sx={{ maxWidth: 60 }}
          >
            <ClearIcon fontSize="small" />
          </Button>
        </Tooltip>
      )}
    </ButtonGroup>
  );
};

export default PostsMenuFilterButton;
