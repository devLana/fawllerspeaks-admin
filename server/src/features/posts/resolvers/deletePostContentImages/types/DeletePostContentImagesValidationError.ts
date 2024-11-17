import type {
  DeletePostContentImagesValidationError as ValidationError,
  DeletePostContentImagesValidationErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DeletePostContentImagesValidationError implements ValidationError {
  readonly status: Status;

  constructor(readonly imagesError: string) {
    this.status = "ERROR";
  }
}

export const DeletePostContentImagesValidationErrorResolvers: Resolvers = {
  __isTypeOf: root => root instanceof DeletePostContentImagesValidationError,
};
