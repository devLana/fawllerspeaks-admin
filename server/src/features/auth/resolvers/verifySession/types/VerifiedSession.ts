import type {
  VerifiedSession as VerifiedSessionResponse,
  VerifiedSessionResolvers as Resolvers,
  User,
  Status,
} from "@resolverTypes";

export class VerifiedSession implements VerifiedSessionResponse {
  readonly status: Status;

  constructor(readonly user: User, readonly accessToken: string) {
    this.status = "SUCCESS";
  }
}

export const VerifiedSessionResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof VerifiedSession,
};
