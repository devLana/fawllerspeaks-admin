import {
  type VerifyResetTokenValidationErrorResolvers as Resolvers,
  type VerifyResetTokenValidationError as Errors,
  Status,
} from "@resolverTypes";

export class VerifyResetTokenValidationError implements Errors {
  readonly status: Status;

  constructor(public readonly tokenError: string) {
    this.status = Status.Error;
  }
}

export const VerifyResetTokenValidationErrorResolver: Resolvers = {
  __isTypeOf: parent => parent instanceof VerifyResetTokenValidationError,
};
