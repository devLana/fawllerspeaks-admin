import { GET_CACHED_POSTS_NEXT_PAGE_DATA } from "@queries/getPosts/GET_CACHED_POSTS_NEXT_PAGE_DATA";
import type { EvictSubsequentGetPostsFieldsOptions } from "types/posts";
import type { QueryGetPostsArgs } from "@apiTypes";

const evictSubsequentGetPostsFieldsOnView = ({
  cache,
  getPostsMap,
  args,
  fieldData,
  slug,
}: EvictSubsequentGetPostsFieldsOptions) => {
  const hasPost = fieldData.posts.some(postRef => {
    return postRef.__ref === `Post:${slug}`;
  });

  if (!hasPost) return;

  let currentArgs: QueryGetPostsArgs = { ...args };
  let nextCursor: string | null = null;

  do {
    const page = cache.readQuery({
      query: GET_CACHED_POSTS_NEXT_PAGE_DATA,
      variables: currentArgs,
    });

    nextCursor = page?.getPosts.pageData.next ?? null;

    const hasEvicted = cache.evict({
      fieldName: "getPosts",
      args: currentArgs,
      broadcast: false,
    });

    if (hasEvicted) getPostsMap.delete(JSON.stringify(currentArgs));

    if (nextCursor) {
      delete currentArgs.after;
      currentArgs = { after: nextCursor, ...currentArgs };
    }
  } while (nextCursor);
};

export default evictSubsequentGetPostsFieldsOnView;
