import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PaginationLink from "./PaginationLink";
import type { GetPostsPageData } from "@apiTypes";

type PostsPaginationLinksProps = Omit<GetPostsPageData, "__typename">;

const PostsPagination = ({ after, before }: PostsPaginationLinksProps) => {
  if (!before && !after) return null;

  return (
    <Box
      sx={{
        px: 1,
        display: "flex",
        rowGap: 0.25,
        columnGap: 5,
        flexWrap: "wrap",
      }}
    >
      <PaginationLink cursor={before ? ["before", before] : undefined}>
        <ArrowBackIcon fontSize="small" />
        Previous Page
      </PaginationLink>
      <PaginationLink cursor={after ? ["after", after] : undefined} ml="auto">
        Next Page <ArrowForwardIcon fontSize="small" />
      </PaginationLink>
    </Box>
  );
};

export default PostsPagination;
