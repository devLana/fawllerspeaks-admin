import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PaginationLink from "./PaginationLink";

interface PostsPaginationLinksProps {
  after: { cursor: string; hasNextPage: boolean } | null;
  before: { cursor: string; hasPreviousPage: boolean } | null;
}

const PostsPagination = ({ after, before }: PostsPaginationLinksProps) => {
  if (!before && !after) return null;

  return (
    <Box
      px={1}
      mt={6}
      display="flex"
      rowGap={0.25}
      columnGap={5}
      flexWrap="wrap"
    >
      <PaginationLink
        href={before?.hasPreviousPage ? `before/${before.cursor}` : undefined}
      >
        <ArrowBackIcon fontSize="small" />
        Previous Page
      </PaginationLink>
      <PaginationLink
        ml="auto"
        href={after?.hasNextPage ? `after/${after.cursor}` : undefined}
      >
        Next Page <ArrowForwardIcon fontSize="small" />
      </PaginationLink>
    </Box>
  );
};

export default PostsPagination;
