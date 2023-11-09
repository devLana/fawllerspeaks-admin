import type {
  VerifyResetTokenValidationErrorResolvers as Resolvers,
  VerifyResetTokenValidationError as Errors,
  Status,
} from "@resolverTypes";

export class VerifyResetTokenValidationError implements Errors {
  readonly status: Status;

  constructor(readonly tokenError: string) {
    this.status = "ERROR";
  }
}

export const VerifyResetTokenValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof VerifyResetTokenValidationError,
};
