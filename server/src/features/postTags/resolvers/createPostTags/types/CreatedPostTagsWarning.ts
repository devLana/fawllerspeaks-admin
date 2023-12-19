import type {
  CreatedPostTagsWarning as Tags,
  CreatedPostTagsWarningResolvers as Resolvers,
  PostTag,
  Status,
} from "@resolverTypes";

export class CreatedPostTagsWarning implements Tags {
  readonly status: Status;

  constructor(readonly tags: PostTag[], readonly message: string) {
    this.status = "WARN";
  }
}

export const CreatedPostTagsWarningResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof CreatedPostTagsWarning,
};
