import Button from "@mui/material/Button";
import type { SxProps } from "@mui/material/styles";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import NextLink from "@components/ui/NextLink";
import type { GetPostsPageType } from "@apiTypes";

interface PaginationLinkProps {
  cursor: [GetPostsPageType, string] | undefined;
  children: React.ReactNode;
  ml?: string;
}

const PaginationLink = ({ children, cursor, ml }: PaginationLinkProps) => {
  const { queryParams } = usePostsFilters();

  const styles: SxProps = {
    ml,
    display: "inline-flex",
    alignItems: "center",
    columnGap: 1,
  };

  if (cursor) {
    const query = {
      ...(queryParams.status && { status: queryParams.status }),
      ...(queryParams.sort && { sort: queryParams.sort }),
    };

    return (
      <NextLink
        href={{ pathname: `/posts/${cursor.join("/")}`, query }}
        sx={{ ...styles }}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <Button
      variant="text"
      disabled
      sx={{ ...styles, font: "inherit", fontStyle: "oblique" }}
    >
      {children}
    </Button>
  );
};

export default PaginationLink;
