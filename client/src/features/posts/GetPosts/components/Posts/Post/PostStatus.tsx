import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import type { SxProps } from "@mui/material/styles";

import { postStatusColors } from "@utils/posts/postStatusColors";
import type { PostStatus as Status } from "@apiTypes";

interface PostStatusProps {
  status: Status;
  isLoadingMore: boolean;
}

const PostStatus = ({ status, isLoadingMore }: PostStatusProps) => {
  const styles: SxProps = { position: "absolute", top: "13px", right: "5px" };

  return (
    <>
      {isLoadingMore ? (
        <Skeleton sx={{ ...styles, transform: "scale(1, 0.75)" }}>
          <Chip label={status} />
        </Skeleton>
      ) : (
        <Chip
          label={status}
          size="small"
          sx={{
            ...styles,
            fontWeight: "bold",
            letterSpacing: 0.5,
            color: ({ appTheme }) => {
              return postStatusColors(status, appTheme.themeMode);
            },
          }}
        />
      )}
    </>
  );
};

export default PostStatus;
