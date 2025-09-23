import { type ApolloCache, type Reference } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { GET_CACHED_POSTS_NEXT_PAGE_DATA } from "@queries/getPosts/GET_CACHED_POSTS_NEXT_PAGE_DATA";
import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import type { PostData } from "types/posts";
import type { GetPostsFieldsMapData } from "types/posts/getPosts";
import type { EditPostData } from "types/posts/editPost";
import type { PostStatus, QueryGetPostsArgs } from "@apiTypes";

type Update = (
  oldSlug: string,
  oldStatus: PostStatus
) => MutationBaseOptions<EditPostData>["update"];

interface GetPostsRef {
  __typename?: "GetPostsData";
  posts: Reference[];
}

interface EvictGetPostsFields extends GetPostsFieldsMapData {
  cache: ApolloCache<unknown>;
  getPostsMap: Map<string, GetPostsFieldsMapData>;
  editedPost: PostData;
  oldSlug: string;
  oldStatus: PostStatus;
}

function evictGetPostsFields({
  cache,
  getPostsMap,
  args,
  fieldData,
  editedPost,
  oldSlug,
  oldStatus,
}: EvictGetPostsFields) {
  if (args.status === editedPost.status) {
    cache.evict({ fieldName: "getPosts", args, broadcast: false });
  } else if (args.status === oldStatus) {
    const hasPost = fieldData.posts.some(postRef => {
      return postRef.__ref === `Post:{"url":{"slug":"${oldSlug}"}}`;
    });

    if (!hasPost) return;

    const currentArgs: QueryGetPostsArgs = { ...args };
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
        currentArgs.after = nextCursor;
      }
    } while (nextCursor);
  }
}

export const update: Update = (oldSlug: string, oldStatus) => {
  return (cache, { data }) => {
    if (data?.editPost.__typename !== "SinglePost") return;

    const editedPost = data.editPost.post;

    if (editedPost.url.slug !== oldSlug) {
      const getPostsMap = buildGetPostsMap(cache);

      if (getPostsMap.size === 0) return;

      getPostsMap.forEach(({ args, fieldData }) => {
        if (args.sort === "title_asc" || args.sort === "title_desc") {
          cache.evict({ fieldName: "getPosts", args, broadcast: false });
        } else if (editedPost.status !== oldStatus) {
          evictGetPostsFields({
            args,
            cache,
            editedPost,
            fieldData,
            getPostsMap,
            oldSlug,
            oldStatus,
          });
        }
      });

      /*
        Swap out any pre-edited post with the edited version.
        To be called after calling evictGetPostsFields() which removes getPosts fields from the cache
      */
      cache.modify<{ getPosts: GetPostsRef }>({
        id: "ROOT_QUERY",
        fields: {
          getPosts(getPostsRef, { readField, toReference }) {
            const posts = (getPostsRef as GetPostsRef).posts.map(postRef => {
              const slug = readField("slug", readField("url", postRef));

              if (typeof slug !== "string" || slug !== oldSlug) return postRef;

              return toReference(editedPost) as Reference;
            });

            return { ...getPostsRef, posts };
          },
        },
      });
    } else if (editedPost.status !== oldStatus) {
      const getPostsMap = buildGetPostsMap(cache);

      if (getPostsMap.size === 0) return;

      getPostsMap.forEach(({ args, fieldData }) => {
        evictGetPostsFields({
          args,
          cache,
          editedPost,
          fieldData,
          getPostsMap,
          oldSlug,
          oldStatus,
        });
      });
    }
  };
};
