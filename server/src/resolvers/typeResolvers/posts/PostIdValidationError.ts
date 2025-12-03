import type { PostIdValidationError as Error, Status } from "@resolverTypes";

export class PostIdValidationError implements Error {
  readonly status: Status;
  readonly __typename: "PostIdValidationError";

  constructor(public readonly postIdError: string) {
    this.status = "ERROR";
    this.__typename = "PostIdValidationError";
  }
}
