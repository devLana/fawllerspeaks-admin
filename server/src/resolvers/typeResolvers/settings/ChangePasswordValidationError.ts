import type {
  ChangePasswordValidationError as ValidationErrors,
  Status,
} from "@appTypes/resolverTypes";

export class ChangePasswordValidationError implements ValidationErrors {
  readonly status: Status;
  readonly __typename: "ChangePasswordValidationError";

  constructor(
    readonly currentPasswordError?: string,
    readonly newPasswordError?: string,
    readonly confirmNewPasswordError?: string
  ) {
    this.status = "ERROR";
    this.__typename = "ChangePasswordValidationError";
  }
}
