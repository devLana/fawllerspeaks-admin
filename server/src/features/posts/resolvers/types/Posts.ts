import type {
  Posts as BlogPosts,
  PostsResolvers,
  Status,
} from "@resolverTypes";

import type { PostData, PostDataMapper } from "@types";

export class Posts implements PostDataMapper<BlogPosts> {
  readonly status: Status;

  constructor(readonly posts: PostData[]) {
    this.status = "SUCCESS";
  }
}

export const PostsResolver: PostsResolvers = {
  __isTypeOf: parent => parent instanceof Posts,
};
