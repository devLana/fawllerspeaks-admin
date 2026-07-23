import type {
  EditedPostTag as Tag,
  PostTag,
  Status,
} from "@appTypes/resolverTypes";

export class EditedPostTag implements Tag {
  readonly status: Status;
  readonly __typename: "EditedPostTag";

  constructor(readonly tag: PostTag) {
    this.status = "SUCCESS";
    this.__typename = "EditedPostTag";
  }
}
