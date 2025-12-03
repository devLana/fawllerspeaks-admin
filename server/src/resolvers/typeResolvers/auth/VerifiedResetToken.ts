import type {
  VerifiedResetToken as VerifiedResetTokenResponse,
  Status,
} from "@resolverTypes";

export class VerifiedResetToken implements VerifiedResetTokenResponse {
  readonly status: Status;
  readonly __typename: "VerifiedResetToken";

  constructor(readonly email: string, readonly resetToken: string) {
    this.status = "SUCCESS";
    this.__typename = "VerifiedResetToken";
  }
}
