import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

import type { PostsQueryParams, PostsQueryParamsHandler } from "@types";

interface SearchboxProps {
  onChangeSearchQuery: PostsQueryParamsHandler;
  queryParams: PostsQueryParams;
}

const Searchbox = ({ queryParams, onChangeSearchQuery }: SearchboxProps) => {
  const { "post-tag": postTag, q, sort, status } = queryParams;
  const { query, push } = useRouter();

  const handleSearch = () => {
    if (q && q !== query.q) {
      void push({
        pathname: "/posts",
        query: {
          q,
          ...(postTag && { "post-tag": postTag }),
          ...(status && { status }),
          ...(sort && { sort }),
        },
      });
    }
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box display="flex" flexGrow={1} maxWidth={700}>
      <TextField
        id="posts-search"
        type="search"
        label="Search Posts"
        autoComplete="off"
        size="small"
        fullWidth
        onKeyUp={handleKeyUp}
        onChange={({ target: { value } }) => onChangeSearchQuery("q", value)}
        value={q || ""}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      />
      <Button
        aria-label="Search posts submit"
        onClick={handleSearch}
        variant="outlined"
        sx={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          minWidth: "auto",
        }}
      >
        <SearchIcon />
      </Button>
    </Box>
  );
};

export default Searchbox;
