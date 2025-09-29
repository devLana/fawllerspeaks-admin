import { GET_CACHED_POSTS_NEXT_PAGE_DATA } from "@queries/getPosts/GET_CACHED_POSTS_NEXT_PAGE_DATA";
import objectsAreEqual from "./objectsAreEqual";
import type { QueryGetPostsArgs } from "@apiTypes";
import type { EvictSubsequentGetPostsFieldsOptions } from "types/posts";

interface EvictOptions extends EvictSubsequentGetPostsFieldsOptions {
  gqlVariables: QueryGetPostsArgs;
  cacheUpdateQuery?: VoidFunction;
}

const evictSubsequentGetPostsFieldsOnPosts = ({
  cache,
  getPostsMap,
  args,
  fieldData,
  slug,
  gqlVariables,
  cacheUpdateQuery,
}: EvictOptions) => {
  const hasPost = fieldData.posts.some(postRef => {
    return postRef.__ref === `Post:{"url":{"slug":"${slug}"}}`;
  });

  if (!hasPost) return;

  const gqlVariablesCopy = {
    ...(gqlVariables.after && { after: gqlVariables.after }),
    size: gqlVariables.size ?? 12,
    sort: gqlVariables.sort ?? "date_desc",
    ...(gqlVariables.status && { status: gqlVariables.status }),
  };

  let currentArgs: QueryGetPostsArgs = { ...args };
  let nextCursor: string | null = null;

  if (objectsAreEqual(gqlVariablesCopy, args)) {
    /*
      if provided, call cacheUpdateQuery() to remove the modified post from the current active field and page
    */
    cacheUpdateQuery?.();

    if (!fieldData.pageData.next) return;

    delete currentArgs.after;
    currentArgs = { after: fieldData.pageData.next, ...currentArgs };
  }

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

export default evictSubsequentGetPostsFieldsOnPosts;
