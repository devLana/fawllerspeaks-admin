import {
  type PostTagsWarning as Tags,
  type PostTagsWarningResolvers,
  type PostTag,
  Status,
} from "@resolverTypes";

export class PostTagsWarning implements Tags {
  readonly status: Status;

  constructor(
    public readonly tags: PostTag[],
    public readonly message: string
  ) {
    this.status = Status.Warn;
  }
}

export const PostTagsWarningResolver: PostTagsWarningResolvers = {
  __isTypeOf: parent => parent instanceof PostTagsWarning,
};
