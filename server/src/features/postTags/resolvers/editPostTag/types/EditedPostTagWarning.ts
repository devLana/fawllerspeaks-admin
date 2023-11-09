import type {
  EditedPostTagWarning as TagWarning,
  EditedPostTagWarningResolvers as Resolvers,
  PostTag,
  Status,
} from "@resolverTypes";

export class EditedPostTagWarning implements TagWarning {
  readonly status: Status;

  constructor(readonly tag: PostTag, readonly message: string) {
    this.status = "WARN";
  }
}

export const EditedPostTagWarningResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditedPostTagWarning,
};
