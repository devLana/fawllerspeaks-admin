import type { BaseResponse, Status } from "@resolverTypes";

class ErrorResponse implements BaseResponse {
  readonly status: Status;

  constructor(readonly message: string) {
    this.status = "ERROR";
  }
}

export class Response implements BaseResponse {
  constructor(readonly message: string, readonly status: Status = "SUCCESS") {}
}

export class NotAllowedError extends ErrorResponse {}
export class UnknownError extends ErrorResponse {}
export class ServerError extends ErrorResponse {}
export class RegistrationError extends ErrorResponse {}
export class AuthenticationError extends ErrorResponse {}
export class UserSessionError extends ErrorResponse {}
export class ForbiddenError extends ErrorResponse {}
export class AuthCookieError extends ErrorResponse {}
