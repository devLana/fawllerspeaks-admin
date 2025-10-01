import type { PostStatus } from "@apiTypes";
import { getPostsFieldsRegex } from "./getPostsFieldsRegex";
import buildGetPostsMap from "./buildGetPostsMap";
import type { ApolloCache } from "@apollo/client";

const evictGetPostsFieldsOnCreatePost = (
  cache: ApolloCache<unknown>,
  status: PostStatus
) => {
  const regex = getPostsFieldsRegex(status);
  const getPostsMap = buildGetPostsMap(cache, regex);

  getPostsMap.forEach(({ args }) => {
    cache.evict({ fieldName: "getPosts", args, broadcast: false });
  });
};

export default evictGetPostsFieldsOnCreatePost;
