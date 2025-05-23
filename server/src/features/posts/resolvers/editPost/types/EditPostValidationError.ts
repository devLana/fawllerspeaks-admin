import type {
  EditPostValidationError as Errors,
  EditPostValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";
import type { RemoveNull } from "@types";

type ValidationErrors = RemoveNull<Omit<Errors, "status">>;

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

  constructor(errors: ValidationErrors) {
    this.idError = errors.idError;
    this.titleError = errors.titleError;
    this.descriptionError = errors.descriptionError;
    this.excerptError = errors.excerptError;
    this.contentError = errors.contentError;
    this.tagIdsError = errors.tagIdsError;
    this.imageBannerError = errors.imageBannerError;
    this.editStatusError = errors.editStatusError;
    this.status = "ERROR";
  }
}

export const EditPostValidationErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof EditPostValidationError,
};
