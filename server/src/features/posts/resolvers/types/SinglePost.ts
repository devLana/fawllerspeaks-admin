import {
  type SinglePost as BlogPost,
  type SinglePostResolvers,
  type Post,
  Status,
} from "@resolverTypes";

export class SinglePost implements BlogPost {
  readonly status: Status;

  constructor(public readonly post: Post) {
    this.status = Status.Success;
  }
}

export const SinglePostResolver: SinglePostResolvers = {
  __isTypeOf: parent => parent instanceof SinglePost,
};
