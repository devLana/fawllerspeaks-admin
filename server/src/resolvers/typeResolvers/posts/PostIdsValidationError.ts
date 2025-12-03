import type {
  PostIdsValidationError as ValidationError,
  Status,
} from "@resolverTypes";

export class PostIdsValidationError implements ValidationError {
  readonly status: Status;
  readonly __typename: "PostIdsValidationError";

  constructor(public readonly postIdsError: string) {
    this.status = "ERROR";
    this.__typename = "PostIdsValidationError";
  }
}
