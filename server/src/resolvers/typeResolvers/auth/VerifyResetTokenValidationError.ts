import type {
  VerifyResetTokenValidationError as Errors,
  Status,
} from "@resolverTypes";

export class VerifyResetTokenValidationError implements Errors {
  readonly status: Status;
  readonly __typename: "VerifyResetTokenValidationError";

  constructor(readonly tokenError: string) {
    this.status = "ERROR";
    this.__typename = "VerifyResetTokenValidationError";
  }
}
