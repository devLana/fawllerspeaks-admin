import {
  type LoginValidationErrorResolvers as Resolvers,
  type LoginValidationError as Errors,
  Status,
} from "@resolverTypes";

export class LoginValidationError implements Errors {
  readonly status: Status;

  constructor(
    public readonly emailError?: string,
    public readonly passwordError?: string,
    public readonly sessionIdError?: string
  ) {
    this.status = Status.Error;
  }
}

export const LoginValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof LoginValidationError,
};
