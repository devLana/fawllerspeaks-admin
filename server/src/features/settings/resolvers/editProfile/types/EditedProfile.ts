import {
  type EditedProfileResolvers as Resolvers,
  type EditedProfile as EditedUserProfile,
  type User,
  Status,
} from "@resolverTypes";

export class EditedProfile implements EditedUserProfile {
  readonly status: Status;

  constructor(readonly user: User) {
    this.status = Status.Success;
  }
}

export const EditedProfileResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditedProfile,
};
