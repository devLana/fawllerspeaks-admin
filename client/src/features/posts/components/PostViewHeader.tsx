import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PostsPageBackButton from "@features/posts/components/PostsPageBackButton";
import { postStatusColors as colors } from "@utils/posts/postStatusColors";
import type { PostViewHeaderProps } from "types/posts";
import type { SxPropsArray } from "@types";

const PostViewHeader = ({
  buttonLabel,
  status,
  title,
  children,
  status_menu_sx: sx,
  onClick,
}: PostViewHeaderProps) => {
  const sxProps: SxPropsArray = Array.isArray(sx) ? sx : [sx];

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
        sx={[{ bgcolor: "action.selected", borderRadius: "16px" }, ...sxProps]}
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
