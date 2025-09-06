import Button from "@mui/material/Button";
import type { SxProps } from "@mui/material/styles";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import NextLink from "@components/ui/NextLink";

interface PaginationLinkProps {
  cursor: string | undefined;
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

  if (typeof cursor === "string") {
    const query = {
      ...(queryParams.size && { size: queryParams.size }),
      ...(queryParams.sort && { sort: queryParams.sort }),
      ...(queryParams.status && { status: queryParams.status }),
    };

    const pathname = cursor ? `/posts/after/${cursor}` : "/posts";

    return (
      <NextLink href={{ pathname, query }} sx={{ ...styles }}>
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
