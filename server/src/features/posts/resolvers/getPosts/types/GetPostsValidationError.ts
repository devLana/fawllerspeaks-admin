import type {
  GetPostsValidationErrorResolvers as Resolvers,
  GetPostsValidationError as Errors,
  Status,
} from "@resolverTypes";
import type { RemoveNull } from "@types";

type ValidationErrors = RemoveNull<Omit<Errors, "status">>;

export class GetPostsValidationError implements Errors {
  readonly cursorError?: string;
  readonly typeError?: string;
  readonly qError?: string;
  readonly postTagError?: string;
  readonly statusError?: string;
  readonly sortError?: string;
  readonly status: Status;

  constructor(errors: ValidationErrors) {
    this.cursorError = errors.cursorError;
    this.typeError = errors.typeError;
    this.qError = errors.qError;
    this.postTagError = errors.postTagError;
    this.statusError = errors.statusError;
    this.sortError = errors.sortError;
    this.status = "ERROR";
  }
}

export const GetPostsValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof GetPostsValidationError,
};
