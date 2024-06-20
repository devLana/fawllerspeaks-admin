import type {
  PostValidationError as Errors,
  PostValidationErrorResolvers,
  Status,
} from "@resolverTypes";
import type { RemoveNull } from "@types";

type ValidationErrors = RemoveNull<Omit<Errors, "status">>;

export class PostValidationError implements Errors {
  readonly titleError?: string;
  readonly descriptionError?: string;
  readonly excerptError?: string;
  readonly contentError?: string;
  readonly tagIdsError?: string;
  readonly imageBannerError?: string;
  readonly status: Status;

  constructor(errors: ValidationErrors) {
    this.titleError = errors.titleError;
    this.descriptionError = errors.descriptionError;
    this.excerptError = errors.excerptError;
    this.contentError = errors.contentError;
    this.tagIdsError = errors.tagIdsError;
    this.imageBannerError = errors.imageBannerError;
    this.status = "ERROR";
  }
}

export const PostValidationErrorResolver: PostValidationErrorResolvers = {
  __isTypeOf: parent => parent instanceof PostValidationError,
};
