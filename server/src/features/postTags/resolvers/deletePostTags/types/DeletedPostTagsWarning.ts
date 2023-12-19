import type {
  DeletedPostTagsWarning as Tags,
  DeletedPostTagsWarningResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DeletedPostTagsWarning implements Tags {
  readonly status: Status;

  constructor(readonly tagIds: string[], readonly message: string) {
    this.status = "WARN";
  }
}

export const DeletedPostTagsWarningResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof DeletedPostTagsWarning,
};
