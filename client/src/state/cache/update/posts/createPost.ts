import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import evictGetPostsFieldsOnCreatePost from "@utils/posts/evictGetPostsFieldsOnCreatePost";
import type { CreatePostGQLData } from "types/posts/createPost";

type Update = MutationBaseOptions<CreatePostGQLData>["update"];

export const update: Update = (cache, { data }) => {
  if (data?.createPost.__typename !== "SinglePost") return;
  evictGetPostsFieldsOnCreatePost(cache, data.createPost.post.status);
};
