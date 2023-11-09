import type {
  AccessTokenResolvers as Resolvers,
  AccessToken as AccessTokenData,
  Status,
} from "@resolverTypes";

export class AccessToken implements AccessTokenData {
  readonly status: Status;

  constructor(readonly accessToken: string) {
    this.status = "SUCCESS";
  }
}

export const AccessTokenResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof AccessToken,
};
