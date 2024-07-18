import * as React from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";

import Searchbox from "./Searchbox";
import PostsMenuForm from "./PostMenuForm";
import PostsMenuFilterButton from "./PostsMenuFilterButton";
import type { PostsQueryParams, PostsQueryParamsHandler } from "@types";

const PostsMenu = () => {
  const [formIsVisible, setFormIsVisible] = React.useState(false);
  const [queryParams, setQueryParams] = React.useState<PostsQueryParams>({});

  const { query, isReady } = useRouter();

  React.useEffect(() => {
    if (isReady) {
      const { q, status, sort } = query as PostsQueryParams;
      const { "post-tag": postTag } = query as PostsQueryParams;

      setQueryParams({
        ...(typeof q === "string" && { q }),
        ...(typeof postTag === "string" && { "post-tag": postTag }),
        ...(typeof status === "string" && { status }),
        ...(typeof sort === "string" && { sort }),
      });
    }
  }, [isReady, query]);

  const handleQueryParams: PostsQueryParamsHandler = (key, value) => {
    setQueryParams({ ...queryParams, [key]: value });
  };

  return (
    <>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        rowGap={3}
        columnGap={4}
        mb={1.5}
      >
        <Searchbox
          onChangeSearchQuery={handleQueryParams}
          queryParams={queryParams}
        />
        <PostsMenuFilterButton
          onToggleFormVisibility={() => setFormIsVisible(!formIsVisible)}
          onClearQueryParams={() => setQueryParams({})}
        />
      </Box>
      <Collapse
        in={formIsVisible}
        sx={{
          mb: 6,
          transition: ({ transitions }) => {
            return transitions.create(["margin-bottom", "height"]);
          },
        }}
      >
        <PostsMenuForm
          queryParams={queryParams}
          onChangeQueryParam={handleQueryParams}
        />
      </Collapse>
    </>
  );
};

export default PostsMenu;
