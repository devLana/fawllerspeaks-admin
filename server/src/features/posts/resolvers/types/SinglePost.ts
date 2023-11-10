import type {
  SinglePost as BlogPost,
  SinglePostResolvers,
  Post,
  Status,
} from "@resolverTypes";

export class SinglePost implements BlogPost {
  readonly status: Status;

  constructor(public readonly post: Post) {
    this.status = "SUCCESS";
  }
}

export const SinglePostResolver: SinglePostResolvers = {
  __isTypeOf: parent => parent instanceof SinglePost,
};
