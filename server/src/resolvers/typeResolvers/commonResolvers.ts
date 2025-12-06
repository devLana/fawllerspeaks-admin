import type { BaseResponse as BR, Status } from "@resolverTypes";

type ErrorResponseNames =
  | "AuthCookieError"
  | "AuthenticationError"
  | "ForbiddenError"
  | "NotAllowedError"
  | "RegistrationError"
  | "ServerError"
  | "UnknownError"
  | "UserSessionError"
  | "NotAllowedPostActionError"
  | "DuplicatePostTagError";

export class ErrorResponse<T extends ErrorResponseNames> implements BR {
  readonly status: Status;

  constructor(readonly __typename: T, readonly message: string) {
    this.status = "ERROR";
  }
}

export class Response implements BR {
  readonly __typename: "Response";

  constructor(
    readonly message: string,
    readonly status: Exclude<Status, "ERROR"> = "SUCCESS"
  ) {
    this.__typename = "Response";
  }
}
