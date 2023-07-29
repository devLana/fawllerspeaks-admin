import {
  type EditedProfileResolvers as Resolvers,
  type EditedProfile as EditedUserProfile,
  Status,
} from "@resolverTypes";

export class EditedProfile implements EditedUserProfile {
  readonly status: Status;

  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {
    this.status = Status.Success;
  }
}

export const EditedProfileResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof EditedProfile,
};
