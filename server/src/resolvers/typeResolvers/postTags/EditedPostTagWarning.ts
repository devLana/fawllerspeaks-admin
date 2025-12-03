import type {
  EditedPostTagWarning as TagWarning,
  PostTag,
  Status,
} from "@resolverTypes";

export class EditedPostTagWarning implements TagWarning {
  readonly status: Status;
  readonly __typename: "EditedPostTagWarning";

  constructor(readonly tag: PostTag, readonly message: string) {
    this.status = "WARN";
    this.__typename = "EditedPostTagWarning";
  }
}
