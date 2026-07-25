import { GraphQLError } from "graphql";
import { graphql, HttpResponse } from "msw";
import { VERIFY_RESET_TOKEN } from "@queries/auth/verifyResetToken";

const INVALID_TOKEN = "INVALID_RESET_TOKEN";
const FORBID_TOKEN = "UNKNOWN_EXPIRED_RESET_TOKEN";
export const VERIFIED_TOKEN = "VERIFIED_PASSWORD_RESET_TOKEN";
const UNSUPPORTED_TOKEN = "UNSUPPORTED_RESPONSE_RESET_TOKEN";
const GRAPHQL_TOKEN = "GRAPHQL_ERROR_RESET_TOKEN";
const NETWORK_TOKEN = "NETWORK_ERROR_RESET_TOKEN";
const email = "reset_password_test@mail.org";
export const props = { email, resetToken: VERIFIED_TOKEN };

export const verifyResetHandler = graphql.query(
  VERIFY_RESET_TOKEN,
  ({ variables: { token } }) => {
    if (token === INVALID_TOKEN) {
      return HttpResponse.json({
        data: {
          verifyResetToken: { __typename: "VerifyResetTokenValidationError" },
        },
      });
    }

    if (token === FORBID_TOKEN) {
      return HttpResponse.json({
        data: { verifyResetToken: { __typename: "ForbiddenError" } },
      });
    }

    if (token === VERIFIED_TOKEN) {
      return HttpResponse.json({
        data: {
          verifyResetToken: {
            __typename: "VerifiedResetToken",
            email,
            resetToken: VERIFIED_TOKEN,
          },
        },
      });
    }

    if (token === GRAPHQL_TOKEN) {
      return HttpResponse.json({
        errors: [new GraphQLError("Unable to verify reset variables.token")],
      });
    }

    if (token === NETWORK_TOKEN) return HttpResponse.error();

    if (token === UNSUPPORTED_TOKEN) {
      return HttpResponse.json({
        data: { verifyResetToken: { __typename: "UnsupportedType" } },
      });
    }

    return HttpResponse.json();
  }
);

const label = "Expect a redirect object if";
export const verifiers: Array<[string, string, string]> = [
  [
    `${label} there was a password reset token validation error`,
    INVALID_TOKEN,
    "error",
  ],
  [
    `${label} the password reset token could not be verified`,
    FORBID_TOKEN,
    "error",
  ],
  [
    `${label} the verification request failed with a network error`,
    NETWORK_TOKEN,
    "network",
  ],
  [`${label} the API responded with a graphql error`, GRAPHQL_TOKEN, "error"],
  [
    `${label} the API responds with an unsupported object type`,
    UNSUPPORTED_TOKEN,
    "error",
  ],
];
