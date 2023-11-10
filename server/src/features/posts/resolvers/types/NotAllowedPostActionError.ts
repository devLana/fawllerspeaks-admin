import type {
  NotAllowedPostActionError as Error,
  NotAllowedPostActionErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class NotAllowedPostActionError implements Error {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = "ERROR";
  }
}

export const NotAllowedPostActionErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof NotAllowedPostActionError,
};
