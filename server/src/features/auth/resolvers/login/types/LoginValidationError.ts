import {
  type LoginValidationErrorResolvers as Resolvers,
  type LoginValidationError as Errors,
  Status,
} from "@resolverTypes";

export class LoginValidationError implements Errors {
  readonly status: Status;

  constructor(
    readonly emailError?: string,
    readonly passwordError?: string,
    readonly sessionIdError?: string
  ) {
    this.status = Status.Error;
  }
}

export const LoginValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof LoginValidationError,
};
