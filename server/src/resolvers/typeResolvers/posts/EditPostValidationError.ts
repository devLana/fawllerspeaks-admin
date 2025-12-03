import type { EditPostValidationError as Errors, Status } from "@resolverTypes";
import type { RemoveNull } from "@types";

export class EditPostValidationError implements Errors {
  readonly idError?: string;
  readonly titleError?: string;
  readonly descriptionError?: string;
  readonly excerptError?: string;
  readonly contentError?: string;
  readonly tagIdsError?: string;
  readonly imageBannerError?: string;
  readonly editStatusError?: string;
  readonly status: Status;
  readonly __typename: "EditPostValidationError";

  constructor(errors: RemoveNull<Omit<Errors, "status">>) {
    this.idError = errors.idError;
    this.titleError = errors.titleError;
    this.descriptionError = errors.descriptionError;
    this.excerptError = errors.excerptError;
    this.contentError = errors.contentError;
    this.tagIdsError = errors.tagIdsError;
    this.imageBannerError = errors.imageBannerError;
    this.editStatusError = errors.editStatusError;
    this.status = "ERROR";
    this.__typename = "EditPostValidationError";
  }
}
