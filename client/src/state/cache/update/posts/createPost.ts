import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import evictGetPostsFields from "@utils/posts/evictGetPostsFields";
import type { CreatePostGQLData } from "types/posts/createPost";

type Update = MutationBaseOptions<CreatePostGQLData>["update"];

export const update: Update = (cache, { data }) => {
  if (data?.createPost.__typename !== "SinglePost") return;
  evictGetPostsFields(cache, data.createPost.post.status);
};
