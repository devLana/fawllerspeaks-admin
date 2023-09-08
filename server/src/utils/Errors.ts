import { type BaseResponse, Status } from "@resolverTypes";

export class MailError extends Error {}

export class ApiError extends Error {
  constructor(readonly message: string, readonly statusCode = 500) {
    super(message);
  }
}

export class UnauthenticatedError extends ApiError {
  constructor(readonly message: string) {
    super(message, 401);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(readonly message: string) {
    super(message, 403);
  }
}

export class BadRequestError extends ApiError {
  constructor(readonly message: string) {
    super(message, 400);
  }
}

class ErrorResponse implements BaseResponse {
  readonly status: Status;

  constructor(readonly message: string) {
    this.status = Status.Error;
  }
}

export class Response implements BaseResponse {
  constructor(
    readonly message: string,
    readonly status: Status = Status.Success
  ) {}
}

export class NotAllowedError extends ErrorResponse {}
export class UnknownError extends ErrorResponse {}
export class ServerError extends ErrorResponse {}
export class RegistrationError extends ErrorResponse {}
export class AuthenticationError extends ErrorResponse {}
export class UserSessionError extends ErrorResponse {}
