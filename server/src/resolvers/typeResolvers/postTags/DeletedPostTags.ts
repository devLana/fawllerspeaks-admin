import type { DeletedPostTags as Tags, Status } from "@appTypes/resolverTypes";

export class DeletedPostTags implements Tags {
  readonly status: Status;
  readonly __typename: "DeletedPostTags";

  constructor(readonly tagIds: string[]) {
    this.status = "SUCCESS";
    this.__typename = "DeletedPostTags";
  }
}
