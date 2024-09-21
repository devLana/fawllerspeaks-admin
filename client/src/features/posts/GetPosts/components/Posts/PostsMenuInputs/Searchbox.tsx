import * as React from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";

const Searchbox = () => {
  const { queryParams } = usePostsFilters();
  const [q, setQ] = React.useState("");
  const { push } = useRouter();

  const handleSearch = () => {
    if (q) {
      void push({
        pathname: "/posts/search",
        query: {
          q,
          ...(queryParams.status && { status: queryParams.status }),
          ...(queryParams.sort && { sort: queryParams.sort }),
        },
      });
    }
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TextField
        id="posts-search"
        type="search"
        label="Search Posts"
        autoComplete="off"
        size="small"
        fullWidth
        onKeyUp={handleKeyUp}
        onChange={e => setQ(e.target.value)}
        value={q}
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
