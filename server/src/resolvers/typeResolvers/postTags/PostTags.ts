import type { PostTags as Tags, PostTag, Status } from "@resolverTypes";

export class PostTags implements Tags {
  readonly status: Status;
  readonly __typename: "PostTags";

  constructor(readonly tags: PostTag[]) {
    this.status = "SUCCESS";
    this.__typename = "PostTags";
  }
}
