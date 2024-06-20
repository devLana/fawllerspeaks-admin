import type {
  SinglePost as BlogPost,
  SinglePostResolvers,
  Status,
} from "@resolverTypes";

import type { PostData, PostDataMapper } from "@types";

export class SinglePost implements PostDataMapper<BlogPost> {
  readonly status: Status;

  constructor(public readonly post: PostData) {
    this.status = "SUCCESS";
  }
}

export const SinglePostResolver: SinglePostResolvers = {
  __isTypeOf: parent => parent instanceof SinglePost,
};
