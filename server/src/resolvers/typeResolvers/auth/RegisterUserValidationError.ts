import type { RemoveNull } from "@appTypes";

import type {
  RegisterUserValidationError as Errors,
  Status,
} from "@appTypes/resolverTypes";

export class RegisterUserValidationError implements Errors {
  readonly firstNameError?: string;
  readonly lastNameError?: string;
  readonly passwordError?: string;
  readonly confirmPasswordError?: string;
  readonly status: Status;
  readonly __typename: "RegisterUserValidationError";

  constructor(errors: RemoveNull<Omit<Errors, "status">>) {
    this.firstNameError = errors.firstNameError;
    this.lastNameError = errors.lastNameError;
    this.passwordError = errors.passwordError;
    this.confirmPasswordError = errors.confirmPasswordError;
    this.status = "ERROR";
    this.__typename = "RegisterUserValidationError";
  }
}
