import type { DeletedPostTagsWarning as Tags, Status } from "@resolverTypes";

export class DeletedPostTagsWarning implements Tags {
  readonly status: Status;
  readonly __typename: "DeletedPostTagsWarning";

  constructor(readonly tagIds: string[], readonly message: string) {
    this.status = "WARN";
    this.__typename = "DeletedPostTagsWarning";
  }
}
