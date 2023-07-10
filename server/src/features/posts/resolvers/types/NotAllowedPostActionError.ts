import {
  type NotAllowedPostActionError as Error,
  type NotAllowedPostActionErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class NotAllowedPostActionError implements Error {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = Status.Error;
  }
}

export const NotAllowedPostActionErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof NotAllowedPostActionError,
};
