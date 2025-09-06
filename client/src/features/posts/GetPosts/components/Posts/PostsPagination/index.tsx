import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PaginationLink from "./PaginationLink";
import type { GetPostsPageData } from "@apiTypes";

type PostsPaginationLinksProps = Omit<GetPostsPageData, "__typename">;

const PostsPagination = ({ next, previous }: PostsPaginationLinksProps) => {
  if (typeof next !== "string" && typeof previous !== "string") return null;

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
      <PaginationLink cursor={previous ?? undefined}>
        <ArrowBackIcon fontSize="small" />
        Previous Page
      </PaginationLink>
      <PaginationLink cursor={next ?? undefined} ml="auto">
        Next Page <ArrowForwardIcon fontSize="small" />
      </PaginationLink>
    </Box>
  );
};

export default PostsPagination;
