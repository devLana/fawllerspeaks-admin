import type {
  PostsWarning as BlogPostsWarning,
  PostsWarningResolvers,
  Status,
} from "@resolverTypes";

import type { PostData, PostDataMapper } from "@types";

export class PostsWarning implements PostDataMapper<BlogPostsWarning> {
  readonly status: Status;

  constructor(readonly posts: PostData[], readonly message: string) {
    this.status = "WARN";
  }
}

export const PostsWarningResolver: PostsWarningResolvers = {
  __isTypeOf: parent => parent instanceof PostsWarning,
};
