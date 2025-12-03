import type { PostsWarning as BlogPostsWarning, Status } from "@resolverTypes";

import type { PostData, PostDataMapper } from "types/posts";

export class PostsWarning implements PostDataMapper<BlogPostsWarning> {
  readonly status: Status;
  readonly __typename: "PostsWarning";

  constructor(readonly posts: PostData[], readonly message: string) {
    this.status = "WARN";
    this.__typename = "PostsWarning";
  }
}
