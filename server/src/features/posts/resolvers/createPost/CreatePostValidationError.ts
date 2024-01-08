import type {
  CreatePostValidationError as Errors,
  CreatePostValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";
import type { RemoveNull } from "@types";

type ValidationErrors = RemoveNull<Omit<Errors, "status">>;

export class CreatePostValidationError implements Errors {
  readonly titleError?: string;
  readonly descriptionError?: string;
  readonly contentError?: string;
  readonly tagsError?: string;
  readonly imageBannerError?: string;
  readonly status: Status;

  constructor(errors: ValidationErrors) {
    this.titleError = errors.titleError;
    this.descriptionError = errors.descriptionError;
    this.contentError = errors.contentError;
    this.tagsError = errors.tagsError;
    this.imageBannerError = errors.imageBannerError;
    this.status = "ERROR";
  }
}

export const CreatePostValidationErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof CreatePostValidationError,
};
