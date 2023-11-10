import type {
  PostsWarning as BlogPostsWarning,
  PostsWarningResolvers,
  Post,
  Status,
} from "@resolverTypes";

export class PostsWarning implements BlogPostsWarning {
  readonly status: Status;

  constructor(public readonly posts: Post[], public readonly message: string) {
    this.status = "WARN";
  }
}

export const PostsWarningResolver: PostsWarningResolvers = {
  __isTypeOf: parent => parent instanceof PostsWarning,
};
