import {
  type PostTags as Tags,
  type PostTagsResolvers as Resolvers,
  type PostTag,
  Status,
} from "@resolverTypes";

export class PostTags implements Tags {
  readonly status: Status;

  constructor(readonly tags: PostTag[]) {
    this.status = Status.Success;
  }
}

export const PostTagsResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof PostTags,
};
