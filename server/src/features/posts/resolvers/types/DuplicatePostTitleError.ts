import {
  type DuplicatePostTitleError as Error,
  type DuplicatePostTitleErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DuplicatePostTitleError implements Error {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = Status.Error;
  }
}

export const DuplicatePostTitleErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof DuplicatePostTitleError,
};
