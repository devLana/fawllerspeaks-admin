import {
  type LoggedInUser as LoggedInUserResponse,
  type LoggedInUserResolvers as Resolvers,
  type User,
  Status,
} from "@resolverTypes";

export class LoggedInUser implements LoggedInUserResponse {
  readonly status: Status;

  constructor(
    readonly user: User,
    readonly accessToken: string,
    readonly sessionId: string
  ) {
    this.status = Status.Success;
  }
}

export const LoggedInUserResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof LoggedInUser,
};
