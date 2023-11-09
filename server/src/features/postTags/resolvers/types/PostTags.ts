import type {
  PostTags as Tags,
  PostTagsResolvers as Resolvers,
  PostTag,
  Status,
} from "@resolverTypes";

export class PostTags implements Tags {
  readonly status: Status;

  constructor(readonly tags: PostTag[]) {
    this.status = "SUCCESS";
  }
}

export const PostTagsResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof PostTags,
};
