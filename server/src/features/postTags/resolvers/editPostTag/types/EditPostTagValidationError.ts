import type {
  EditPostTagValidationError as ValidationErrors,
  EditPostTagValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class EditPostTagValidationError implements ValidationErrors {
  readonly status: Status;

  constructor(
    public readonly tagIdError?: string,
    public readonly nameError?: string
  ) {
    this.status = "ERROR";
  }
}

export const EditPostTagValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditPostTagValidationError,
};
