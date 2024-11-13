import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PostMenu from "@features/posts/components/PostMenu";
import PostsPageBackButton from "@features/posts/components/PostsPageBackButton";
import { postStatusColors as colors } from "@utils/posts/postStatusColors";
import type { PostStatus } from "@apiTypes";

interface PostHeaderProps {
  slug: string;
  status: PostStatus;
  title: string;
}

const PostHeader = ({ slug, status, title }: PostHeaderProps) => {
  const { back } = useRouter();

  return (
    <Box sx={{ display: "flex", columnGap: 2, mb: 4.5 }}>
      <PostsPageBackButton
        buttonLabel=" Go back to posts page"
        onClick={() => back()}
      />
      <Box
        sx={{
          ml: "auto",
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
        <PostMenu
          status={status}
          title={title}
          slug={slug}
          sx={{ bgcolor: "action.selected" }}
        />
      </Box>
    </Box>
  );
};

export default PostHeader;
