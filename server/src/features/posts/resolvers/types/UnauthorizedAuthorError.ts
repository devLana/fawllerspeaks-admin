import type {
  UnauthorizedAuthorError as Error,
  UnauthorizedAuthorErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class UnauthorizedAuthorError implements Error {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = "ERROR";
  }
}

export const UnauthorizedAuthorErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof UnauthorizedAuthorError,
};
