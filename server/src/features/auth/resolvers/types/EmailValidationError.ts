import {
  type EmailValidationErrorResolvers,
  type EmailValidationError as Errors,
  Status,
} from "@resolverTypes";

export class EmailValidationError implements Errors {
  readonly status: Status;

  constructor(public readonly emailError: string) {
    this.status = Status.Error;
  }
}

export const EmailValidationErrorResolver: EmailValidationErrorResolvers = {
  __isTypeOf: parent => parent instanceof EmailValidationError,
};
