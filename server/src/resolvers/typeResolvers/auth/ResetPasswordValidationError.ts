import type {
  ResetPasswordValidationError as Errors,
  Status,
} from "@appTypes/resolverTypes";

export class ResetPasswordValidationError implements Errors {
  readonly status: Status;
  readonly __typename: "ResetPasswordValidationError";

  constructor(
    readonly tokenError?: string,
    readonly passwordError?: string,
    readonly confirmPasswordError?: string,
  ) {
    this.status = "ERROR";
    this.__typename = "ResetPasswordValidationError";
  }
}
