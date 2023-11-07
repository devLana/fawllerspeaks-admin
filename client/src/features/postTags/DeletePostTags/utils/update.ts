import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { Mutation } from "@apiTypes";
import type { CachePostTags } from "@types";

type Update = MutationBaseOptions<Pick<Mutation, "deletePostTags">>["update"];
type GetPostTagsRef = CachePostTags["getPostTags"];

export const update: Update = (cache, { data }) => {
  if (data?.deletePostTags.__typename === "PostTags") {
    const deletedPostTagsIds = new Set<string>();

    data.deletePostTags.tags.forEach(tag => {
      deletedPostTagsIds.add(tag.id);
    });

    cache.modify({
      fields: {
        getPostTags(getPostTagsRef: GetPostTagsRef, { readField }) {
          const updatedTags = getPostTagsRef.tags.filter(tagRef => {
            const id = readField("id", tagRef);

            if (typeof id !== "string") return false;

            return !deletedPostTagsIds.has(id);
          });

          return { ...getPostTagsRef, tags: updatedTags };
        },
      },
    });
  }
};
