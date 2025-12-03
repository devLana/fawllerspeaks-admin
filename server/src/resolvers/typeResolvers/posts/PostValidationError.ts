import type { PostValidationError as Errors, Status } from "@resolverTypes";
import type { RemoveNull } from "@types";

export class PostValidationError implements Errors {
  readonly titleError?: string;
  readonly descriptionError?: string;
  readonly excerptError?: string;
  readonly contentError?: string;
  readonly tagIdsError?: string;
  readonly imageBannerError?: string;
  readonly status: Status;
  readonly __typename: "PostValidationError";

  constructor(errors: RemoveNull<Omit<Errors, "status">>) {
    this.titleError = errors.titleError;
    this.descriptionError = errors.descriptionError;
    this.excerptError = errors.excerptError;
    this.contentError = errors.contentError;
    this.tagIdsError = errors.tagIdsError;
    this.imageBannerError = errors.imageBannerError;
    this.status = "ERROR";
    this.__typename = "PostValidationError";
  }
}
