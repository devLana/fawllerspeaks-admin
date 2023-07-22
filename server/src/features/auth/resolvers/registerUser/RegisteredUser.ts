import {
  type RegisteredUser as RegisteredUserResponse,
  type RegisteredUserResolvers as Resolvers,
  type User,
  Status,
} from "@resolverTypes";

export class RegisteredUser implements RegisteredUserResponse {
  readonly status: Status;

  constructor(readonly user: User) {
    this.status = Status.Success;
  }
}

export const RegisteredUserResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof RegisteredUser,
};
