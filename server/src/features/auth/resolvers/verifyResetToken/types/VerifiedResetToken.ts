import {
  type VerifiedResetTokenResolvers as Resolvers,
  type VerifiedResetToken as VerifiedResetTokenResponse,
  Status,
} from "@resolverTypes";

export class VerifiedResetToken implements VerifiedResetTokenResponse {
  readonly status: Status;

  constructor(
    public readonly email: string,
    public readonly resetToken: string
  ) {
    this.status = Status.Success;
  }
}

export const VerifiedResetTokenResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof VerifiedResetToken,
};
