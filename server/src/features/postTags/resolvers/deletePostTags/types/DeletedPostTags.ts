import type {
  DeletedPostTags as Tags,
  DeletedPostTagsResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DeletedPostTags implements Tags {
  readonly status: Status;

  constructor(readonly tagIds: string[]) {
    this.status = "SUCCESS";
  }
}

export const DeletedPostTagsResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof DeletedPostTags,
};
