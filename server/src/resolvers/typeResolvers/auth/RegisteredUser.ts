import type {
  RegisteredUser as RegisteredUserResponse,
  User,
  Status,
} from "@resolverTypes";

export class RegisteredUser implements RegisteredUserResponse {
  readonly status: Status;
  readonly __typename: "RegisteredUser";

  constructor(readonly user: User) {
    this.status = "SUCCESS";
    this.__typename = "RegisteredUser";
  }
}
