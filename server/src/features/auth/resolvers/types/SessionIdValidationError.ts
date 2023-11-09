import type {
  SessionIdValidationErrorResolvers as Resolvers,
  SessionIdValidationError as Errors,
  Status,
} from "@resolverTypes";

export class SessionIdValidationError implements Errors {
  readonly status: Status;

  constructor(readonly sessionIdError: string) {
    this.status = "ERROR";
  }
}

export const SessionIdValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof SessionIdValidationError,
};
