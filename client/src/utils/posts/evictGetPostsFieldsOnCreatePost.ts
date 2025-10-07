import type { PostStatus } from "@apiTypes";
import buildGetPostsMap from "./buildGetPostsMap";
import { getPostsFieldsRegex } from "./regex/getPostsFieldsRegex";
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

  // cache.gc()
};

export default evictGetPostsFieldsOnCreatePost;
