import type { Reference } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import type { DeletePostTagsData } from "@types";

type Update = MutationBaseOptions<DeletePostTagsData>["update"];

interface PostTagRefs {
  __typename?: "PostTags";
  tags: Reference[];
}

interface CachePostTags {
  getPostTags: PostTagRefs;
}

export const update: Update = (cache, { data }) => {
  if (data?.deletePostTags.__typename === "DeletedPostTags") {
    const deletedPostTagIdsSet = new Set(data.deletePostTags.tagIds);

    cache.modify<CachePostTags>({
      fields: {
        getPostTags(getPostTagsRef, { readField }) {
          const tags = (getPostTagsRef as PostTagRefs).tags.filter(tagRef => {
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
