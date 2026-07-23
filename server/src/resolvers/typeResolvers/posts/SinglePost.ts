import type { SinglePost as BlogPost, Status } from "@appTypes/resolverTypes";
import type { PostData, PostDataMapper } from "@appTypes/posts";

export class SinglePost implements PostDataMapper<BlogPost> {
  readonly status: Status;
  readonly __typename: "SinglePost";

  constructor(public readonly post: PostData) {
    this.status = "SUCCESS";
    this.__typename = "SinglePost";
  }
}
