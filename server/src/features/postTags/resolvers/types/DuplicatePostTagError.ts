import {
  type DuplicatePostTagError as Error,
  type DuplicatePostTagErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DuplicatePostTagError implements Error {
  readonly status: Status;

  constructor(readonly message: string) {
    this.status = Status.Error;
  }
}

export const DuplicatePostTagErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof DuplicatePostTagError,
};
