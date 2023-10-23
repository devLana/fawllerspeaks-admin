import {
  type EditedPostTagWarning as TagWarning,
  type EditedPostTagWarningResolvers as Resolvers,
  type PostTag,
  Status,
} from "@resolverTypes";

export class EditedPostTagWarning implements TagWarning {
  readonly status: Status;

  constructor(readonly tag: PostTag, readonly message: string) {
    this.status = Status.Warn;
  }
}

export const EditedPostTagWarningResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditedPostTagWarning,
};
