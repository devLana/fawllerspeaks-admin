import {
  type UnauthorizedAuthorError as Error,
  type UnauthorizedAuthorErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class UnauthorizedAuthorError implements Error {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = Status.Error;
  }
}

export const UnauthorizedAuthorErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof UnauthorizedAuthorError,
};
