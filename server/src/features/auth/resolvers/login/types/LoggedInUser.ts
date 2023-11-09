import type {
  LoggedInUser as LoggedInUserResponse,
  LoggedInUserResolvers as Resolvers,
  User,
  Status,
} from "@resolverTypes";

export class LoggedInUser implements LoggedInUserResponse {
  readonly status: Status;

  constructor(
    readonly user: User,
    readonly accessToken: string,
    readonly sessionId: string
  ) {
    this.status = "SUCCESS";
  }
}

export const LoggedInUserResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof LoggedInUser,
};
