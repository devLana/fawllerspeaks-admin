import type { Reference } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import type { DeletePostTagsData } from "types/postTags/deletePostTags";

type Update = MutationBaseOptions<DeletePostTagsData>["update"];

interface PostTagsRef {
  __typename?: "PostTags";
  tags: Reference[];
}

interface CachePostTags {
  getPostTags: PostTagsRef;
}

export const update: Update = (cache, { data }) => {
  if (data?.deletePostTags.__typename === "DeletedPostTags") {
    const deletedPostTagIdsSet = new Set(data.deletePostTags.tagIds);

    cache.modify<CachePostTags>({
      fields: {
        getPostTags(getPostTagsRef, { readField }) {
          const tags = (getPostTagsRef as PostTagsRef).tags.filter(tagRef => {
            const id = readField("id", tagRef);

            if (typeof id !== "string") return false;

            return !deletedPostTagIdsSet.has(id);
          });

          return { ...getPostTagsRef, tags };
        },
      },
    });
  }
};
