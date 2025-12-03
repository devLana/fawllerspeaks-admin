import type {
  LoggedInUser as LoggedInUserResponse,
  User,
  Status,
} from "@resolverTypes";

export class LoggedInUser implements LoggedInUserResponse {
  readonly status: Status;
  readonly __typename: "LoggedInUser";

  constructor(
    readonly user: User,
    readonly accessToken: string,
    readonly sessionId: string
  ) {
    this.status = "SUCCESS";
    this.__typename = "LoggedInUser";
  }
}
