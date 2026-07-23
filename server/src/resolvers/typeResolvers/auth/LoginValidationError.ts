import type {
  LoginValidationError as ValidationErrors,
  Status,
} from "@appTypes/resolverTypes";

export class LoginValidationError implements ValidationErrors {
  readonly status: Status;
  readonly __typename: "LoginValidationError";

  constructor(
    readonly emailError?: string,
    readonly passwordError?: string,
  ) {
    this.status = "ERROR";
    this.__typename = "LoginValidationError";
  }
}
