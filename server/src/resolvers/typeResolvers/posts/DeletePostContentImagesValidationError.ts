import type {
  DeletePostContentImagesValidationError as ValidationError,
  Status,
} from "@appTypes/resolverTypes";

export class DeletePostContentImagesValidationError implements ValidationError {
  readonly status: Status;
  readonly __typename: "DeletePostContentImagesValidationError";

  constructor(readonly imagesError: string) {
    this.status = "ERROR";
    this.__typename = "DeletePostContentImagesValidationError";
  }
}
