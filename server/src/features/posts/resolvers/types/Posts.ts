import {
  type Posts as BlogPosts,
  type PostsResolvers,
  type Post,
  Status,
} from "@resolverTypes";

export class Posts implements BlogPosts {
  readonly status: Status;

  constructor(public readonly posts: Post[]) {
    this.status = Status.Success;
  }
}

export const PostsResolver: PostsResolvers = {
  __isTypeOf: parent => parent instanceof Posts,
};
