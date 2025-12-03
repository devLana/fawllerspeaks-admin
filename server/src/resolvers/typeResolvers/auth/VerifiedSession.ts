import type {
  VerifiedSession as VerifiedSessionResponse,
  User,
  Status,
} from "@resolverTypes";

export class VerifiedSession implements VerifiedSessionResponse {
  readonly status: Status;
  readonly __typename: "VerifiedSession";

  constructor(readonly user: User, readonly accessToken: string) {
    this.status = "SUCCESS";
    this.__typename = "VerifiedSession";
  }
}
