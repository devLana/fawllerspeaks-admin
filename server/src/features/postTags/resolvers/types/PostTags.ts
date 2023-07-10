import {
  type PostTags as Tags,
  type PostTagsResolvers,
  type PostTag,
  Status,
} from "@resolverTypes";

export class PostTags implements Tags {
  readonly status: Status;

  constructor(public readonly tags: PostTag[]) {
    this.status = Status.Success;
  }
}

export const PostTagsResolver: PostTagsResolvers = {
  __isTypeOf: parent => parent instanceof PostTags,
};
