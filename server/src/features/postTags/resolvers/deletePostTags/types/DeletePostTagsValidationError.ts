import type {
  DeletePostTagsValidationError as ValidationError,
  DeletePostTagsValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DeletePostTagsValidationError implements ValidationError {
  readonly status: Status;

  constructor(readonly tagIdsError: string) {
    this.status = "ERROR";
  }
}

export const DeletePostTagsValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof DeletePostTagsValidationError,
};
