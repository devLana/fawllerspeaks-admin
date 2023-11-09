import type {
  EditedProfileResolvers as Resolvers,
  EditedProfile as EditedUserProfile,
  User,
  Status,
} from "@resolverTypes";

export class EditedProfile implements EditedUserProfile {
  readonly status: Status;

  constructor(readonly user: User) {
    this.status = "SUCCESS";
  }
}

export const EditedProfileResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditedProfile,
};
