import type {
  LoginValidationErrorResolvers as Resolvers,
  LoginValidationError as ValidationErrors,
  Status,
} from "@resolverTypes";

export class LoginValidationError implements ValidationErrors {
  readonly status: Status;

  constructor(
    readonly emailError?: string,
    readonly passwordError?: string,
    readonly sessionIdError?: string
  ) {
    this.status = "ERROR";
  }
}

export const LoginValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof LoginValidationError,
};
