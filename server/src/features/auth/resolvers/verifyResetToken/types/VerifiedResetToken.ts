import type {
  VerifiedResetTokenResolvers as Resolvers,
  VerifiedResetToken as VerifiedResetTokenResponse,
  Status,
} from "@resolverTypes";

export class VerifiedResetToken implements VerifiedResetTokenResponse {
  readonly status: Status;

  constructor(readonly email: string, readonly resetToken: string) {
    this.status = "SUCCESS";
  }
}

export const VerifiedResetTokenResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof VerifiedResetToken,
};
