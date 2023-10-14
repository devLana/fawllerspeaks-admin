import {
  type AccessTokenResolvers as Resolvers,
  type AccessToken as AccessTokenData,
  Status,
} from "@resolverTypes";

export class AccessToken implements AccessTokenData {
  readonly status: Status;

  constructor(readonly accessToken: string) {
    this.status = Status.Success;
  }
}

export const AccessTokenResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof AccessToken,
};
