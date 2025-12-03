import type { GetPostsValidationError as Errors, Status } from "@resolverTypes";
import type { RemoveNull } from "@types";

export class GetPostsValidationError implements Errors {
  readonly afterError?: string;
  readonly sizeError?: string;
  readonly sortError?: string;
  readonly statusError?: string;
  readonly status: Status;
  readonly __typename: "GetPostsValidationError";

  constructor(errors: RemoveNull<Omit<Errors, "status">>) {
    this.afterError = errors.afterError;
    this.sizeError = errors.sizeError;
    this.sortError = errors.sortError;
    this.statusError = errors.statusError;
    this.status = "ERROR";
    this.__typename = "GetPostsValidationError";
  }
}
