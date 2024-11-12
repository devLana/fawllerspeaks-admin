import Skeleton from "@mui/material/Skeleton";
import NextLink from "@components/ui/NextLink";

interface PostItemLinkProps {
  isLoadingMore: boolean;
  slug: string;
}

const PostItemLink = ({ isLoadingMore, slug }: PostItemLinkProps) => {
  return isLoadingMore ? (
    <Skeleton
      variant="text"
      height={32}
      sx={{
        mt: "auto",
        mx: "auto",
        width: "90%",
        maxWidth: 400,
        borderRadius: 1,
        transform: "scale(1)",
      }}
    >
      <NextLink href={{ pathname: "view/[slug]", query: { slug } }}>
        View Post
      </NextLink>
    </Skeleton>
  ) : (
    <NextLink
      href={{ pathname: "view/[slug]", query: { slug } }}
      sx={{
        mt: "auto",
        mx: "auto",
        py: 0.4,
        width: "90%",
        maxWidth: 400,
        borderRadius: 1,
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
