import type {
  CreatePostTagsValidationError as ValidationError,
  CreatePostTagsValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class CreatePostTagsValidationError implements ValidationError {
  readonly status: Status;

  constructor(readonly tagsError: string) {
    this.status = "ERROR";
  }
}

export const CreatePostTagsValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof CreatePostTagsValidationError,
};
