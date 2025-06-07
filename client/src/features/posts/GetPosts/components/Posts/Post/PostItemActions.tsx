import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Skeleton from "@mui/material/Skeleton";

import PostMenu from "@features/posts/components/PostMenu";
import type { PostStatus } from "@apiTypes";
import type { GetPostsListAction } from "types/posts/getPosts";

interface PostItemActionsProps {
  id: string;
  index: number;
  title: string;
  slug: string;
  status: PostStatus;
  isChecked: boolean;
  isLoadingMore: boolean;
  skipOnChange: React.MutableRefObject<boolean>;
  dispatch: React.Dispatch<GetPostsListAction>;
  onShiftPlusClick: (shiftKey: boolean, index: number, id: string) => void;
}

const PostItemActions = ({
  id,
  index,
  title,
  slug,
  status,
  isChecked,
  isLoadingMore,
  skipOnChange,
  dispatch,
  onShiftPlusClick,
}: PostItemActionsProps) => {
  const skipOnChangeRef = skipOnChange;

  const handleChange = (checked: boolean) => {
    if (skipOnChangeRef.current) {
      skipOnChangeRef.current = false;
    } else {
      dispatch({ type: "SELECT_POST", payload: { checked, title, id } });
    }
  };

  return isLoadingMore ? (
    <Skeleton
      variant="rounded"
      width={70}
      height={30}
      sx={{ position: "absolute", top: "5px", left: "5px" }}
    />
  ) : (
    <Box
      sx={{
        display: "flex",
        position: "absolute",
        top: "5px",
        left: "5px",
        borderRadius: 1,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Checkbox
        id={`${slug}-checkbox`}
        size="small"
        checked={isChecked}
        onChange={e => handleChange(e.target.checked)}
        onClick={e => onShiftPlusClick(e.shiftKey, index, id)}
        inputProps={{ "aria-label": title }}
        sx={({ shape }) => ({
          borderRadius: 0,
          borderTopLeftRadius: `${shape.borderRadius}px`,
          borderBottomLeftRadius: `${shape.borderRadius}px`,
        })}
      />
      <PostMenu
        title={title}
        status={status}
        slug={slug}
        sx={({ shape }) => ({
          borderRadius: 0,
          borderTopRightRadius: `${shape.borderRadius}px`,
          borderBottomRightRadius: `${shape.borderRadius}px`,
        })}
      />
    </Box>
  );
};

export default PostItemActions;
