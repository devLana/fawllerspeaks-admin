import type {
  PostIdsValidationError as ValidationError,
  PostIdsValidationErrorResolvers,
  Status,
} from "@resolverTypes";

export class PostIdsValidationError implements ValidationError {
  readonly status: Status;

  constructor(public readonly postIdsError: string) {
    this.status = "ERROR";
  }
}

export const PostIdsValidationErrorResolver: PostIdsValidationErrorResolvers = {
  __isTypeOf: parent => parent instanceof PostIdsValidationError,
};
