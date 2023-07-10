import {
  type UserData as UserDataResponse,
  type User,
  type UserDataResolvers,
  Status,
} from "@resolverTypes";

export class UserData implements UserDataResponse {
  readonly status: Status;

  constructor(public readonly user: User) {
    this.status = Status.Success;
  }
}

export const UserDataResolver: UserDataResolvers = {
  __isTypeOf: parent => parent instanceof UserData,
};
