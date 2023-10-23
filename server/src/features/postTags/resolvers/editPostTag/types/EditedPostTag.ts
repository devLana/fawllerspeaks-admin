import {
  type EditedPostTag as Tag,
  type EditedPostTagResolvers as Resolvers,
  type PostTag,
  Status,
} from "@resolverTypes";

export class EditedPostTag implements Tag {
  readonly status: Status;

  constructor(readonly tag: PostTag) {
    this.status = Status.Success;
  }
}

export const EditedPostTagResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditedPostTag,
};
