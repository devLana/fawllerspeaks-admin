import {
  type EditedPostTag as Tag,
  type EditedPostTagResolvers,
  type PostTag,
  Status,
} from "@resolverTypes";

export class EditedPostTag implements Tag {
  readonly status: Status;

  constructor(public readonly tag: PostTag) {
    this.status = Status.Success;
  }
}

export const EditedPostTagResolver: EditedPostTagResolvers = {
  __isTypeOf: parent => parent instanceof EditedPostTag,
};
