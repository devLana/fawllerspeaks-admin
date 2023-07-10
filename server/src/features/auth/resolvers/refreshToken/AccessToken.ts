import {
  type AccessTokenResolvers,
  type AccessToken as AccessTokenData,
  Status,
} from "@resolverTypes";

export class AccessToken implements AccessTokenData {
  readonly status: Status;

  constructor(public readonly accessToken: string) {
    this.status = Status.Success;
  }
}

export const AccessTokenResolver: AccessTokenResolvers = {
  __isTypeOf: parent => parent instanceof AccessToken,
};
