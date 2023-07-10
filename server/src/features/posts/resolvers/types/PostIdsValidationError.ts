import {
  type PostIdsValidationError as Error,
  type PostIdsValidationErrorResolvers,
  Status,
} from "@resolverTypes";

export class PostIdsValidationError implements Error {
  readonly status: Status;

  constructor(public readonly postIdsError: string) {
    this.status = Status.Error;
  }
}

export const PostIdsValidationErrorResolver: PostIdsValidationErrorResolvers = {
  __isTypeOf: parent => parent instanceof PostIdsValidationError,
};
