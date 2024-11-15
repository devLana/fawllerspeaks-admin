import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import Button from "@mui/material/Button";
import NextLink from "@components/ui/NextLink";
import type { GetPostsPageType } from "@apiTypes";

interface PaginationLinkProps {
  cursor: [GetPostsPageType, string] | undefined;
  children: React.ReactNode;
  ml?: string;
}

const PaginationLink = ({ children, cursor, ml }: PaginationLinkProps) => {
  const { queryParams } = usePostsFilters();
  const styles = { display: "inline-flex", alignItems: "center", columnGap: 1 };

  if (cursor) {
    const query = {
      ...(queryParams.status && { status: queryParams.status }),
      ...(queryParams.sort && { sort: queryParams.sort }),
    };

    return (
      <NextLink
        href={{ pathname: `/posts/${cursor.join("/")}`, query }}
        sx={{ ml, ...styles }}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <Button
      variant="text"
      disabled
      sx={{ ml, ...styles, font: "inherit", fontStyle: "oblique" }}
    >
      {children}
    </Button>
  );
};

export default PaginationLink;
