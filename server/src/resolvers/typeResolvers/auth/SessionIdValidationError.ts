import type {
  SessionIdValidationError as Errors,
  Status,
} from "@resolverTypes";

export class SessionIdValidationError implements Errors {
  readonly status: Status;
  readonly __typename: "SessionIdValidationError";

  constructor(readonly sessionIdError: string) {
    this.status = "ERROR";
    this.__typename = "SessionIdValidationError";
  }
}
