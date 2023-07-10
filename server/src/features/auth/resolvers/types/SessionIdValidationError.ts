import {
  type SessionIdValidationErrorResolvers as Resolvers,
  type SessionIdValidationError as Errors,
  Status,
} from "@resolverTypes";

export class SessionIdValidationError implements Errors {
  readonly status: Status;

  constructor(public readonly sessionIdError: string) {
    this.status = Status.Error;
  }
}

export const SessionIdValidationErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof SessionIdValidationError,
};
