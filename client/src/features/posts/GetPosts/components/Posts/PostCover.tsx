import Box from "@mui/material/Box";
import type { PostsView } from "types/posts/getPosts";

interface PostCoverProps {
  isFetchingMore: boolean;
  postsView: PostsView;
}

const PostCover = ({ isFetchingMore, postsView }: PostCoverProps) => (
  <Box
    sx={{
      position: "absolute",
      ...(isFetchingMore && {
        inset: 0,
        zIndex: "mobileStepper",
        bgcolor: "action.active",
        ...(postsView === "grid" && { borderRadius: 1 }),
      }),
      transition({ transitions }) {
        return transitions.create(["background-color"]);
      },
    }}
  />
);

export default PostCover;
