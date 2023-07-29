import {
  type ResetPasswordValidationErrorResolvers as Resolvers,
  type ResetPasswordValidationError as Errors,
  Status,
} from "@resolverTypes";

export class ResetPasswordValidationError implements Errors {
  readonly status: Status;

  constructor(
    public readonly tokenError?: string,
    public readonly passwordError?: string,
    public readonly confirmPasswordError?: string
  ) {
    this.status = Status.Error;
  }
}

export const ResetPasswordValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof ResetPasswordValidationError,
};
