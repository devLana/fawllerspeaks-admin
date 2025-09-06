import type {
  GetPostsValidationErrorResolvers as Resolvers,
  GetPostsValidationError as Errors,
  Status,
} from "@resolverTypes";
import type { RemoveNull } from "@types";

type ValidationErrors = RemoveNull<Omit<Errors, "status">>;

export class GetPostsValidationError implements Errors {
  readonly afterError?: string;
  readonly sizeError?: string;
  readonly sortError?: string;
  readonly statusError?: string;
  readonly status: Status;

  constructor(errors: ValidationErrors) {
    this.afterError = errors.afterError;
    this.sizeError = errors.sizeError;
    this.sortError = errors.sortError;
    this.statusError = errors.statusError;
    this.status = "ERROR";
  }
}

export const GetPostsValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof GetPostsValidationError,
};
