import Box from "@mui/material/Box";
import type { PostsView } from "../../types";

interface PostCoverProps {
  isFetchingMore: boolean;
  postsView: PostsView;
}

const PostCover = ({ isFetchingMore, postsView }: PostCoverProps) => (
  <Box
    position="absolute"
    {...(isFetchingMore && {
      bgcolor: "action.active",
      zIndex: "mobileStepper",
      ...(postsView === "grid" && { borderRadius: 1 }),
    })}
    sx={{
      transition({ transitions }) {
        return transitions.create(["background-color"]);
      },
      ...(isFetchingMore && { inset: 0 }),
    }}
  />
);

export default PostCover;
