import type { Reference } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import type { Mutation } from "@apiTypes";

type Update = MutationBaseOptions<Pick<Mutation, "deletePostTags">>["update"];

interface PostTagRefs {
  tags: Reference[];
}

interface CachePostTags {
  getPostTags: PostTagRefs;
}

export const update: Update = (cache, { data }) => {
  if (data?.deletePostTags.__typename === "PostTags") {
    const deletedPostTagsIds = new Set<string>();

    data.deletePostTags.tags.forEach(tag => {
      deletedPostTagsIds.add(tag.id);
    });

    cache.modify<CachePostTags>({
      fields: {
        getPostTags(getPostTagsRef, { readField }) {
          const tags = (getPostTagsRef as PostTagRefs).tags.filter(tagRef => {
            const id = readField("id", tagRef);

            if (typeof id !== "string") return false;

            return !deletedPostTagsIds.has(id);
          });

          return { ...getPostTagsRef, tags };
        },
      },
    });
  }
};
