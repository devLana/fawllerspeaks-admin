import type {
  EditProfileValidationErrorResolvers as Resolvers,
  EditProfileValidationError as Errors,
  Status,
} from "@resolverTypes";

export class EditProfileValidationError implements Errors {
  readonly status: Status;

  constructor(
    readonly firstNameError?: string,
    readonly lastNameError?: string,
    readonly imageError?: string
  ) {
    this.status = "ERROR";
  }
}

export const EditProfileValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditProfileValidationError,
};
