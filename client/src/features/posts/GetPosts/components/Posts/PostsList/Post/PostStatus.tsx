import Typography from "@mui/material/Typography";

import { postStatusBgColors } from "../utils/postStatusBgColors";
import type { PostStatus as Status } from "@apiTypes";
import type { PostsView } from "@features/posts/GetPosts/types";

interface PostStatusProps {
  status: Status;
  postsView: PostsView;
}

const PostStatus = ({ status, postsView }: PostStatusProps) => (
  <Typography
    variant="caption"
    sx={({ shape }) => ({
      position: "absolute",
      top: 0,
      right: 0,
      px: 2.5,
      py: 0.7,
      color: "background.default",
      fontWeight: "bold",
      letterSpacing: 1,
      bgcolor: ({ appTheme: { themeMode } }) => {
        return postStatusBgColors(status, themeMode);
      },
      borderBottomLeftRadius: `${shape.borderRadius}px`,
      ...(postsView === "grid"
        ? { borderTopRightRadius: `${shape.borderRadius}px` }
        : { borderBottomRightRadius: `${shape.borderRadius}px` }),
    })}
  >
    {status}
  </Typography>
);

export default PostStatus;
