import type {
  SessionData as SessionDataResponse,
  User,
  Status,
} from "@appTypes/resolverTypes";

export class SessionData implements SessionDataResponse {
  readonly status: Status;
  readonly __typename: "SessionData";

  constructor(
    readonly user: User,
    readonly accessToken: string,
  ) {
    this.status = "SUCCESS";
    this.__typename = "SessionData";
  }
}
