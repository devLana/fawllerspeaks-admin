import Skeleton from "@mui/material/Skeleton";
import type { SxProps } from "@mui/material/styles";

import NextLink from "@components/ui/NextLink";

interface PostItemLinkProps {
  isLoadingMore: boolean;
  slug: string;
}

const PostItemLink = ({ isLoadingMore, slug }: PostItemLinkProps) => {
  const styles: SxProps = {
    mt: "auto",
    mx: "auto",
    width: "90%",
    maxWidth: 400,
    borderRadius: 1,
  };

  return isLoadingMore ? (
    <Skeleton
      variant="text"
      height={32}
      sx={{ ...styles, transform: "scale(1)" }}
    />
  ) : (
    <NextLink
      href={`/posts/view/${slug}`}
      sx={{
        ...styles,
        py: 0.4,
        textAlign: "center",
        color: "background.default",
        bgcolor: "secondary.main",
        ":hover": { color: "background.default" },
      }}
    >
      View Post
    </NextLink>
  );
};

export default PostItemLink;
