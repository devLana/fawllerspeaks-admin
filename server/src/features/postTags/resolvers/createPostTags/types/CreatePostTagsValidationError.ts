import {
  type CreatePostTagsValidationError as Error,
  type CreatePostTagsValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class CreatePostTagsValidationError implements Error {
  readonly status: Status;

  constructor(public readonly tagsError: string) {
    this.status = Status.Error;
  }
}

export const CreatePostTagsValidationErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof CreatePostTagsValidationError,
};
