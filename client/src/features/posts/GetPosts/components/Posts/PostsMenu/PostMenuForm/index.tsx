import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import PostTagsInput from "./PostTagsInput";
import PostStatusInput from "./PostStatusInput";
import SortByInput from "./SortByInput";
import type { PostsQueryParams, PostsQueryParamsHandler } from "@types";

interface PostsMenuFormProps {
  queryParams: PostsQueryParams;
  onChangeQueryParam: PostsQueryParamsHandler;
}

const PostsMenuForm = ({
  queryParams,
  onChangeQueryParam,
}: PostsMenuFormProps) => {
  const { "post-tag": postTag, sort, status, q } = queryParams;
  const { push, query } = useRouter();

  const submitHandler: React.FormEventHandler = e => {
    e.preventDefault();

    if (
      (postTag && postTag !== query["post-tag"]) ||
      (status && status !== query.status) ||
      (sort && sort !== query.sort)
    ) {
      void push({
        pathname: "/posts",
        query: {
          ...(q && { q }),
          ...(postTag && { "post-tag": postTag }),
          ...(status && { status }),
          ...(sort && { sort }),
        },
      });
    }
  };

  return (
    <Box
      component="form"
      aria-label="Posts menu"
      onSubmit={submitHandler}
      p={2}
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(200px, auto))"
      rowGap={2.4}
      columnGap={3}
      bgcolor="action.disabledBackground"
    >
      <PostTagsInput postTag={postTag} onChange={onChangeQueryParam} />
      <PostStatusInput postStatus={status} onChange={onChangeQueryParam} />
      <SortByInput sortBy={sort} onChange={onChangeQueryParam} />
      <Button variant="contained" type="submit">
        Apply Filters
      </Button>
    </Box>
  );
};

export default PostsMenuForm;
