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
