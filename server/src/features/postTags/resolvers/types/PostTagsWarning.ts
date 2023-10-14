import {
  type PostTagsWarning as Tags,
  type PostTagsWarningResolvers as Resolvers,
  type PostTag,
  Status,
} from "@resolverTypes";

export class PostTagsWarning implements Tags {
  readonly status: Status;

  constructor(readonly tags: PostTag[], readonly message: string) {
    this.status = Status.Warn;
  }
}

export const PostTagsWarningResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof PostTagsWarning,
};
