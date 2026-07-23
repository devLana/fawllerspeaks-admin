import type {
  EditPostTagValidationError as ValidationErrors,
  Status,
} from "@appTypes/resolverTypes";

export class EditPostTagValidationError implements ValidationErrors {
  readonly status: Status;
  readonly __typename: "EditPostTagValidationError";

  constructor(
    public readonly tagIdError?: string,
    public readonly nameError?: string,
  ) {
    this.status = "ERROR";
    this.__typename = "EditPostTagValidationError";
  }
}
