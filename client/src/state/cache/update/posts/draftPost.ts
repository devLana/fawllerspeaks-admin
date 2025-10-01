import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import evictGetPostsFieldsOnCreatePost from "@utils/posts/evictGetPostsFieldsOnCreatePost";
import type { DraftPostData } from "types/posts/createPost";

type Update = MutationBaseOptions<DraftPostData>["update"];

export const update: Update = (cache, { data }) => {
  if (data?.draftPost.__typename !== "SinglePost") return;
  evictGetPostsFieldsOnCreatePost(cache, data.draftPost.post.status);
};
