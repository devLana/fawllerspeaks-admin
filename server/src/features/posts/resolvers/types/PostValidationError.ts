import type {
  PostValidationError as Errors,
  PostValidationErrorResolvers,
  Status,
} from "@resolverTypes";
import type { RemoveNull } from "@types";

type ValidationErrors = RemoveNull<Omit<Errors, "status">>;

export class PostValidationError implements Errors {
  readonly postIdError?: string;
  readonly titleError?: string;
  readonly descriptionError?: string;
  readonly contentError?: string;
  readonly tagsError?: string;
  readonly imageBannerError?: string;
  readonly status: Status;

  constructor(errors: ValidationErrors) {
    this.postIdError = errors.postIdError;
    this.titleError = errors.titleError;
    this.descriptionError = errors.descriptionError;
    this.contentError = errors.contentError;
    this.tagsError = errors.tagsError;
    this.imageBannerError = errors.imageBannerError;
    this.status = "ERROR";
  }
}

export const PostValidationErrorResolver: PostValidationErrorResolvers = {
  __isTypeOf: parent => parent instanceof PostValidationError,
};
