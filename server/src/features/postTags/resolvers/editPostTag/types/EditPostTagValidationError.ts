import {
  type EditPostTagValidationError as Errors,
  type EditPostTagValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class EditPostTagValidationError implements Errors {
  readonly status: Status;

  constructor(
    public readonly tagIdError?: string,
    public readonly nameError?: string
  ) {
    this.status = Status.Error;
  }
}

export const EditPostTagValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditPostTagValidationError,
};
