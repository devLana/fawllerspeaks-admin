import type {
  EmailValidationErrorResolvers as Resolvers,
  EmailValidationError as ValidationErrors,
  Status,
} from "@resolverTypes";

export class EmailValidationError implements ValidationErrors {
  readonly status: Status;

  constructor(readonly emailError: string) {
    this.status = "ERROR";
  }
}

export const EmailValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EmailValidationError,
};
