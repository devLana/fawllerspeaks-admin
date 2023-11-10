import type {
  DuplicatePostTitleError as Error,
  DuplicatePostTitleErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DuplicatePostTitleError implements Error {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = "ERROR";
  }
}

export const DuplicatePostTitleErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof DuplicatePostTitleError,
};
