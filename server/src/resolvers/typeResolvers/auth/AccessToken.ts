import type { AccessToken as AccessTokenData, Status } from "@resolverTypes";

export class AccessToken implements AccessTokenData {
  readonly status: Status;
  readonly __typename: "AccessToken";

  constructor(readonly accessToken: string) {
    this.status = "SUCCESS";
    this.__typename = "AccessToken";
  }
}
