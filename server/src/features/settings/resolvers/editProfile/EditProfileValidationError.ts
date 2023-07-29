import {
  type EditProfileValidationErrorResolvers as Resolvers,
  type EditProfileValidationError as Errors,
  Status,
} from "@resolverTypes";

export class EditProfileValidationError implements Errors {
  readonly status: Status;

  constructor(
    public readonly firstNameError?: string,
    public readonly lastNameError?: string
  ) {
    this.status = Status.Error;
  }
}

export const EditProfileValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditProfileValidationError,
};
