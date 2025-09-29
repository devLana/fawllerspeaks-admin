import { GET_CACHED_POSTS } from "@queries/getPosts/GET_CACHED_POSTS";
import evictSubsequentGetPostsFieldsOnPosts from "./evictSubsequentGetPostsFieldsOnPosts";
import type { EvictGetPostsFieldsOptions } from "types/posts";
import type { QueryGetPostsArgs } from "@apiTypes";

interface EvictOptions extends EvictGetPostsFieldsOptions {
  gqlVariables: QueryGetPostsArgs;
}

const evictGetPostsFieldsOnPosts = ({
  cache,
  getPostsMap,
  args,
  fieldData,
  slug,
  newStatus,
  oldStatus,
  gqlVariables,
}: EvictOptions) => {
  if (args.status === newStatus) {
    cache.evict({ fieldName: "getPosts", args, broadcast: false });
  } else if (args.status === oldStatus) {
    evictSubsequentGetPostsFieldsOnPosts({
      cache,
      getPostsMap,
      args,
      fieldData,
      slug,
      gqlVariables,
      cacheUpdateQuery() {
        cache.updateQuery(
          { query: GET_CACHED_POSTS, variables: args },
          cachedData => {
            if (!cachedData) return;

            return {
              getPosts: {
                ...cachedData.getPosts,
                posts: cachedData.getPosts.posts.filter(post => {
                  return post.url.slug !== slug;
                }),
              },
            };
          }
        );
      },
    });
  }
};

export default evictGetPostsFieldsOnPosts;
