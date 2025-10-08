import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import evictGetPostsFields from "@utils/posts/evictGetPostsFields";
import type { DraftPostData } from "types/posts/createPost";

type Update = MutationBaseOptions<DraftPostData>["update"];

export const update: Update = (cache, { data }) => {
  if (data?.draftPost.__typename !== "SinglePost") return;
  evictGetPostsFields(cache, data.draftPost.post.status);
};
