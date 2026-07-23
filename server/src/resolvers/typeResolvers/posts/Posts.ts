import type { Posts as BlogPosts, Status } from "@appTypes/resolverTypes";
import type { PostData, PostDataMapper } from "@appTypes/posts";

export class Posts implements PostDataMapper<BlogPosts> {
  readonly status: Status;
  readonly __typename: "Posts";

  constructor(readonly posts: PostData[]) {
    this.status = "SUCCESS";
    this.__typename = "Posts";
  }
}
