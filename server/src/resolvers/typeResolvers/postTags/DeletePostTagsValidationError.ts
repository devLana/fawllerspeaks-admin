import type {
  DeletePostTagsValidationError as ValidationError,
  Status,
} from "@appTypes/resolverTypes";

export class DeletePostTagsValidationError implements ValidationError {
  readonly status: Status;
  readonly __typename: "DeletePostTagsValidationError";

  constructor(readonly tagIdsError: string) {
    this.status = "ERROR";
    this.__typename = "DeletePostTagsValidationError";
  }
}
