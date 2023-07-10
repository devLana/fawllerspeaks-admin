import {
  type DuplicatePostTagError as Error,
  type DuplicatePostTagErrorResolvers,
  Status,
} from "@resolverTypes";

export class DuplicatePostTagError implements Error {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = Status.Error;
  }
}

export const DuplicatePostTagErrorResolver: DuplicatePostTagErrorResolvers = {
  __isTypeOf: parent => parent instanceof DuplicatePostTagError,
};
