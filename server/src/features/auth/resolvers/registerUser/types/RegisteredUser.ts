import type {
  RegisteredUser as RegisteredUserResponse,
  RegisteredUserResolvers as Resolvers,
  User,
  Status,
} from "@resolverTypes";

export class RegisteredUser implements RegisteredUserResponse {
  readonly status: Status;

  constructor(readonly user: User) {
    this.status = "SUCCESS";
  }
}

export const RegisteredUserResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof RegisteredUser,
};
