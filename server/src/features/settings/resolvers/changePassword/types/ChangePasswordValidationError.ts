import {
  type ChangePasswordValidationErrorResolvers as Resolvers,
  type ChangePasswordValidationError as Errors,
  Status,
} from "@resolverTypes";

export class ChangePasswordValidationError implements Errors {
  readonly status: Status;

  constructor(
    readonly currentPasswordError?: string,
    readonly newPasswordError?: string,
    readonly confirmNewPasswordError?: string
  ) {
    this.status = Status.Error;
  }
}

export const ChangePasswordValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof ChangePasswordValidationError,
};
