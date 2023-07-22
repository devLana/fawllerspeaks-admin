import {
  type VerifiedSession as VerifiedSessionResponse,
  type VerifiedSessionResolvers as Resolvers,
  type User,
  Status,
} from "@resolverTypes";

export class VerifiedSession implements VerifiedSessionResponse {
  readonly status: Status;

  constructor(readonly user: User, readonly accessToken: string) {
    this.status = Status.Success;
  }
}

export const VerifiedSessionResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof VerifiedSession,
};
