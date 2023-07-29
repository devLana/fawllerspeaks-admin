import {
  type RegisterUserValidationErrorResolvers as Resolvers,
  type RegisterUserValidationError as Errors,
  Status,
} from "@resolverTypes";
import type { RemoveNull } from "@types";

type ValidationErrors = RemoveNull<Omit<Errors, "status">>;

export class RegisterUserValidationError implements Errors {
  readonly firstNameError?: string;
  readonly lastNameError?: string;
  readonly passwordError?: string;
  readonly confirmPasswordError?: string;
  readonly status: Status;

  constructor(errors: ValidationErrors) {
    this.firstNameError = errors.firstNameError;
    this.lastNameError = errors.lastNameError;
    this.passwordError = errors.passwordError;
    this.confirmPasswordError = errors.confirmPasswordError;
    this.status = Status.Error;
  }
}

export const RegisterUserValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof RegisterUserValidationError,
};
