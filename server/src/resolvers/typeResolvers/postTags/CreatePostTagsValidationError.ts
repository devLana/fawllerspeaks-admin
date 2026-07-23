import type {
  CreatePostTagsValidationError as ValidationError,
  Status,
} from "@appTypes/resolverTypes";

export class CreatePostTagsValidationError implements ValidationError {
  readonly status: Status;
  readonly __typename: "CreatePostTagsValidationError";

  constructor(readonly tagsError: string) {
    this.status = "ERROR";
    this.__typename = "CreatePostTagsValidationError";
  }
}
