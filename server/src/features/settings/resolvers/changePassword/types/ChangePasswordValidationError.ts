import type {
  ChangePasswordValidationErrorResolvers as Resolvers,
  ChangePasswordValidationError as ValidationErrors,
  Status,
} from "@resolverTypes";

export class ChangePasswordValidationError implements ValidationErrors {
  readonly status: Status;

  constructor(
    readonly currentPasswordError?: string,
    readonly newPasswordError?: string,
    readonly confirmNewPasswordError?: string
  ) {
    this.status = "ERROR";
  }
}

export const ChangePasswordValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof ChangePasswordValidationError,
};
