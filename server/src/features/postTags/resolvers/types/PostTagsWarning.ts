import type {
  PostTagsWarning as Tags,
  PostTagsWarningResolvers as Resolvers,
  PostTag,
  Status,
} from "@resolverTypes";

export class PostTagsWarning implements Tags {
  readonly status: Status;

  constructor(readonly tags: PostTag[], readonly message: string) {
    this.status = "WARN";
  }
}

export const PostTagsWarningResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof PostTagsWarning,
};
