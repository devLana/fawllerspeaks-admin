import { type BaseResponse, Status } from "@resolverTypes";

export class MailError extends Error {}

export class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

class ErrorResponse implements BaseResponse {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = Status.Error;
  }
}

export class Response implements BaseResponse {
  constructor(
    public readonly message: string,
    public readonly status: Status = Status.Success
  ) {}
}

export class NotAllowedError extends ErrorResponse {}
export class UnknownError extends ErrorResponse {}
export class ServerError extends ErrorResponse {}
export class RegistrationError extends ErrorResponse {}
export class AuthenticationError extends ErrorResponse {}
export class UserSessionError extends ErrorResponse {}
