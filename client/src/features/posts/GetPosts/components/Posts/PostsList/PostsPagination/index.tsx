import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PaginationLink from "./PaginationLink";

interface PostsPaginationLinksProps {
  after?: string | null;
  before?: string | null;
}

const PostsPagination = ({ after, before }: PostsPaginationLinksProps) => {
  if (!before && !after) return null;

  return (
    <Box
      sx={{
        px: 1,
        mt: 6,
        display: "flex",
        rowGap: 0.25,
        columnGap: 5,
        flexWrap: "wrap",
      }}
    >
      <PaginationLink href={before ? `before/${before}` : undefined}>
        <ArrowBackIcon fontSize="small" />
        Previous Page
      </PaginationLink>
      <PaginationLink ml="auto" href={after ? `after/${after}` : undefined}>
        Next Page <ArrowForwardIcon fontSize="small" />
      </PaginationLink>
    </Box>
  );
};

export default PostsPagination;
