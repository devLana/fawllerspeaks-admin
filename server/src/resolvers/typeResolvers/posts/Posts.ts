import type { Posts as BlogPosts, Status } from "@resolverTypes";
import type { PostData, PostDataMapper } from "types/posts";

export class Posts implements PostDataMapper<BlogPosts> {
  readonly status: Status;
  readonly __typename: "Posts";

  constructor(readonly posts: PostData[]) {
    this.status = "SUCCESS";
    this.__typename = "Posts";
  }
}
