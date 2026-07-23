import type {
  CreatedPostTagsWarning as Tags,
  PostTag,
  Status,
} from "@appTypes/resolverTypes";

export class CreatedPostTagsWarning implements Tags {
  readonly status: Status;
  readonly __typename: "CreatedPostTagsWarning";

  constructor(
    readonly tags: PostTag[],
    readonly message: string,
  ) {
    this.status = "WARN";
    this.__typename = "CreatedPostTagsWarning";
  }
}
