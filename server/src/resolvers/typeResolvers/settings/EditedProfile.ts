import type {
  EditedProfile as EditedUserProfile,
  User,
  Status,
} from "@appTypes/resolverTypes";

export class EditedProfile implements EditedUserProfile {
  readonly status: Status;
  readonly __typename: "EditedProfile";

  constructor(readonly user: User) {
    this.status = "SUCCESS";
    this.__typename = "EditedProfile";
  }
}
