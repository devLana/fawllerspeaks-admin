import type {
  ResetPasswordValidationErrorResolvers as Resolvers,
  ResetPasswordValidationError as Errors,
  Status,
} from "@resolverTypes";

export class ResetPasswordValidationError implements Errors {
  readonly status: Status;

  constructor(
    readonly tokenError?: string,
    readonly passwordError?: string,
    readonly confirmPasswordError?: string
  ) {
    this.status = "ERROR";
  }
}

export const ResetPasswordValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof ResetPasswordValidationError,
};
