import {
  type DeletePostTagsValidationError as Error,
  type DeletePostTagsValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DeletePostTagsValidationError implements Error {
  readonly status: Status;

  constructor(public readonly tagIdsError: string) {
    this.status = Status.Error;
  }
}

export const DeletePostTagsValidationErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof DeletePostTagsValidationError,
};
