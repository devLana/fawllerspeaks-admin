import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";

import { postStatusColors } from "@utils/posts/postStatusColors";
import type { PostStatus as Status } from "@apiTypes";

interface PostStatusProps {
  status: Status;
  isLoadingMore: boolean;
}

const PostStatus = ({ status, isLoadingMore }: PostStatusProps) => (
  <>
    {isLoadingMore ? (
      <Skeleton
        sx={{
          position: "absolute",
          top: "7px",
          right: "5px",
          transform: "scale(1, 0.75)",
        }}
      >
        <Chip label={status} />
      </Skeleton>
    ) : (
      <Chip
        label={status}
        size="small"
        sx={{
          position: "absolute",
          top: "13px",
          right: "5px",
          fontWeight: "bold",
          letterSpacing: 0.5,
          color: ({ appTheme }) => postStatusColors(status, appTheme.themeMode),
        }}
      />
    )}
  </>
);

export default PostStatus;
