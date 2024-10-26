import { GraphQLError } from "graphql";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { VERIFY_PASSWORD_RESET_TOKEN } from "@mutations/resetPassword/VERIFY_PASSWORD_RESET_TOKEN";
import { mswData, mswErrors } from "@utils/tests/msw";
import type { PageView, Verified } from "types/resetPassword";

interface Dict {
  token: string;
  props: Pick<PageView, "isUnregistered"> | Pick<Verified, "verified">;
}

const VERIFIED_PASSWORD_RESET_TOKEN = "VERIFIED_PASSWORD_RESET_TOKEN";
const INVALID_RESET_TOKEN = "INVALID_RESET_TOKEN";
const UNKNOWN_EXPIRED_RESET_TOKEN = "UNKNOWN_EXPIRED_RESET_TOKEN";
const UNSUPPORTED_RESPONSE_RESET_TOKEN = "UNSUPPORTED_RESPONSE_RESET_TOKEN";
const GRAPHQL_ERROR_RESET_TOKEN = "GRAPHQL_ERROR_RESET_TOKEN";
const NETWORK_ERROR_RESET_TOKEN = "NETWORK_ERROR_RESET_TOKEN";
const UNREGISTERED_RESET_TOKEN = "UNREGISTERED_RESET_TOKEN";
const EMAIL = "reset_password_test@mail.org";

export const server = setupServer(
  graphql.mutation(VERIFY_PASSWORD_RESET_TOKEN, ({ variables: { token } }) => {
    if (token === INVALID_RESET_TOKEN) {
      return mswData("verifyResetToken", "VerifyResetTokenValidationError");
    }

    if (token === UNKNOWN_EXPIRED_RESET_TOKEN) {
      return mswData("verifyResetToken", "NotAllowedError");
    }

    if (token === UNREGISTERED_RESET_TOKEN) {
      return mswData("verifyResetToken", "RegistrationError");
    }

    if (token === VERIFIED_PASSWORD_RESET_TOKEN) {
      return mswData("verifyResetToken", "VerifiedResetToken", {
        email: EMAIL,
        resetToken: VERIFIED_PASSWORD_RESET_TOKEN,
      });
    }

    if (token === UNSUPPORTED_RESPONSE_RESET_TOKEN) {
      return mswData("verifyResetToken", "UnsupportedType");
    }

    if (token === GRAPHQL_ERROR_RESET_TOKEN) {
      return mswErrors(new GraphQLError("Unable to verify reset token"));
    }

    if (token === NETWORK_ERROR_RESET_TOKEN) {
      return mswErrors(new Error(), { status: 503 });
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

export const verifyValidate: [string, string | string[]][] = [
  [
    "Should return a redirect object if there is no password reset token in the query params object",
    "",
  ],
  [
    "Should return a redirect object if there are multiple password reset tokens in the query params object",
    ["token_one", "token_two"],
  ],
];

export const verifyErrorObjects: [string, string, string][] = [
  [
    "Should return a redirect object if the password reset token input validation failed",
    "/forgot-password?status=validation",
    INVALID_RESET_TOKEN,
  ],
  [
    "Should return a redirect object if the password reset token is unknown or has expired",
    "/forgot-password?status=fail",
    UNKNOWN_EXPIRED_RESET_TOKEN,
  ],
  [
    "Should return a redirect object if the reset token verification process returned an unsupported object type",
    "/forgot-password?status=unsupported",
    UNSUPPORTED_RESPONSE_RESET_TOKEN,
  ],
];

export const verifyErrors: [string, string, string][] = [
  [
    "Should return a redirect object if the reset token Verification fails with a network error",
    NETWORK_ERROR_RESET_TOKEN,
    "network",
  ],
  [
    "Should return a redirect object if the reset token Verification throws a graphql error",
    GRAPHQL_ERROR_RESET_TOKEN,
    "api",
  ],
];

export const verified = {
  email: EMAIL,
  resetToken: VERIFIED_PASSWORD_RESET_TOKEN,
};

export const verifyProps: [string, string, Dict][] = [
  [
    "Verification fails for an unregistered user",
    "Should return an 'isUnregistered' props object",
    { token: UNREGISTERED_RESET_TOKEN, props: { isUnregistered: true } },
  ],
  [
    "Password reset token is verified",
    "Should return a 'verified' props object",
    { token: VERIFIED_PASSWORD_RESET_TOKEN, props: { verified } },
  ],
];
