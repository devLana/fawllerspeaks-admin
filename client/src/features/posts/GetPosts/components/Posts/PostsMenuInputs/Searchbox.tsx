import * as React from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import type { PostsQueryParams } from "types/posts/getPosts";

type Query = Pick<PostsQueryParams, "sort" | "status"> & { q: string };

const Searchbox = () => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { push } = useRouter();
  const { queryParams } = usePostsFilters();

  const handleSearch = () => {
    if (!inputRef.current || !inputRef.current.value) return;

    const query: Query = { q: inputRef.current.value };

    if (queryParams.status) {
      query.status = queryParams.status;
    }

    if (queryParams.sort) {
      query.sort = queryParams.sort;
    }

    void push({ pathname: "/posts/search", query });
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TextField
        ref={inputRef}
        id="posts-search"
        type="search"
        label="Search Posts"
        autoComplete="off"
        size="small"
        fullWidth
        onKeyUp={handleKeyUp}
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
