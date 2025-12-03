import type { GetPostValidationError as Error, Status } from "@resolverTypes";

export class GetPostValidationError implements Error {
  readonly status: Status;
  readonly __typename: "GetPostValidationError";

  constructor(readonly slugError: string) {
    this.status = "ERROR";
    this.__typename = "GetPostValidationError";
  }
}
