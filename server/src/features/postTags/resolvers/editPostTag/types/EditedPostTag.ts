import type {
  EditedPostTag as Tag,
  EditedPostTagResolvers as Resolvers,
  PostTag,
  Status,
} from "@resolverTypes";

export class EditedPostTag implements Tag {
  readonly status: Status;

  constructor(readonly tag: PostTag) {
    this.status = "SUCCESS";
  }
}

export const EditedPostTagResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditedPostTag,
};
