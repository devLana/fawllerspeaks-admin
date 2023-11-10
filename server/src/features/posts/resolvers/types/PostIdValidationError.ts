import type {
  PostIdValidationError as Error,
  PostIdValidationErrorResolvers,
  Status,
} from "@resolverTypes";

export class PostIdValidationError implements Error {
  readonly status: Status;

  constructor(public readonly postIdError: string) {
    this.status = "ERROR";
  }
}

export const PostIdValidationErrorResolver: PostIdValidationErrorResolvers = {
  __isTypeOf: parent => parent instanceof PostIdValidationError,
};
