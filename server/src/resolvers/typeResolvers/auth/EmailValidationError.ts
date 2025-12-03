import type {
  EmailValidationError as ValidationErrors,
  Status,
} from "@resolverTypes";

export class EmailValidationError implements ValidationErrors {
  readonly __typename: "EmailValidationError";
  readonly status: Status;

  constructor(readonly emailError: string) {
    this.status = "ERROR";
    this.__typename = "EmailValidationError";
  }
}
