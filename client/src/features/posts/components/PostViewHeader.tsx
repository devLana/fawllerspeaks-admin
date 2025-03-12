import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PostsPageBackButton from "@features/posts/components/PostsPageBackButton";
import { postStatusColors as colors } from "@utils/posts/postStatusColors";
import type { PostViewHeaderProps } from "types/posts";

const PostViewHeader = (props: PostViewHeaderProps) => {
  const { buttonLabel, status, title, children, onClick } = props;

  return (
    <Box
      sx={{
        display: "flex",
        columnGap: 2,
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 4.5,
      }}
    >
      <PostsPageBackButton buttonLabel={buttonLabel} onClick={onClick} />
      <Box
        sx={{
          pl: 1,
          display: "flex",
          alignItems: "center",
          columnGap: 2,
          bgcolor: "action.selected",
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="body2"
          component="span"
          aria-label={`${title} blog post status`}
          sx={{
            color: ({ appTheme }) => colors(status, appTheme.themeMode),
            fontWeight: "bold",
            letterSpacing: 0.5,
          }}
        >
          {status}
        </Typography>
        {children}
      </Box>
    </Box>
  );
};

export default PostViewHeader;
