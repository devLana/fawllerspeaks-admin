import {
  type EmailValidationErrorResolvers as Resolvers,
  type EmailValidationError as Errors,
  Status,
} from "@resolverTypes";

export class EmailValidationError implements Errors {
  readonly status: Status;

  constructor(readonly emailError: string) {
    this.status = Status.Error;
  }
}

export const EmailValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EmailValidationError,
};
