import {
  type PostsWarning as BlogPostsWarning,
  type PostsWarningResolvers,
  type Post,
  Status,
} from "@resolverTypes";

export class PostsWarning implements BlogPostsWarning {
  readonly status: Status;

  constructor(public readonly posts: Post[], public readonly message: string) {
    this.status = Status.Warn;
  }
}

export const PostsWarningResolver: PostsWarningResolvers = {
  __isTypeOf: parent => parent instanceof PostsWarning,
};
