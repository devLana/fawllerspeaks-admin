import type {
  Posts as BlogPosts,
  PostsResolvers,
  Post,
  Status,
} from "@resolverTypes";

export class Posts implements BlogPosts {
  readonly status: Status;

  constructor(public readonly posts: Post[]) {
    this.status = "SUCCESS";
  }
}

export const PostsResolver: PostsResolvers = {
  __isTypeOf: parent => parent instanceof Posts,
};
