import { type Reference } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictGetPostsFieldsOnView from "@utils/posts/evictGetPostsFieldsOnView";
import { editPostRegex } from "@utils/posts/regex/editPostRegex";
import type { EditPostData } from "types/posts/editPost";
import type { PostStatus } from "@apiTypes";

type Update = (
  oldSlug: string,
  oldStatus: PostStatus
) => MutationBaseOptions<EditPostData>["update"];

interface GetPostsRef {
  __typename?: "GetPostsData";
  posts: Reference[];
}

export const update: Update = (oldSlug: string, oldStatus) => {
  return (cache, { data }) => {
    if (data?.editPost.__typename !== "SinglePost") return;

    const editedPost = data.editPost.post;

    if (editedPost.url.slug !== oldSlug) {
      const regex = editPostRegex(oldStatus, editedPost.status);
      const getPostsMap = buildGetPostsMap(cache, regex);

      if (getPostsMap.size === 0) return;

      getPostsMap.forEach(({ args, fieldData }) => {
        if (args.sort === "title_asc" || args.sort === "title_desc") {
          cache.evict({ fieldName: "getPosts", args, broadcast: false });
        } else if (editedPost.status !== oldStatus) {
          evictGetPostsFieldsOnView({
            args,
            cache,
            slug: oldSlug,
            newStatus: editedPost.status,
            oldStatus,
            fieldData,
            getPostsMap,
          });
        }
      });

      /*
        Swap out any pre-edited post with the edited version.
        To be called after calling evictGetPostsFieldsOnView() which removes getPosts fields from the cache
      */
      cache.modify<{ getPosts: GetPostsRef }>({
        id: "ROOT_QUERY",
        fields: {
          getPosts(getPostsRef, { readField, toReference }) {
            const posts = (getPostsRef as GetPostsRef).posts.map(postRef => {
              const slug = readField("slug", readField("url", postRef));

              if (typeof slug !== "string" || slug !== oldSlug) return postRef;

              return toReference(editedPost);
            });

            return { ...getPostsRef, posts };
          },
        },
      });
    } else if (editedPost.status !== oldStatus) {
      const regex = editPostRegex(oldStatus, editedPost.status);
      const getPostsMap = buildGetPostsMap(cache, regex);

      if (getPostsMap.size === 0) return;

      getPostsMap.forEach(({ args, fieldData }) => {
        evictGetPostsFieldsOnView({
          args,
          cache,
          slug: oldSlug,
          newStatus: editedPost.status,
          oldStatus,
          fieldData,
          getPostsMap,
        });
      });
    }
  };
};
