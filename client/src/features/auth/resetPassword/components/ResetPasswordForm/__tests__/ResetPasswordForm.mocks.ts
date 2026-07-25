import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { RESET_PASSWORD } from "@mutations/auth/resetPassword";

export const resetButton = { name: /^reset password$/i };
export const MSG = `Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol`;
export const msg1 = "Password must be at least 8 characters long";
export const msg2 = "Passwords do not match";
const errorMessage = "Unable to verify password reset token";
const pwdStr = (prefix: string) => `${prefix}_p@5Sw0Rd`;

export const resetPasswordHandler = graphql.mutation(
  RESET_PASSWORD,
  async ({ variables: { password } }) => {
    if (password === pwdStr("validate1")) {
      return HttpResponse.json({
        data: {
          resetPassword: {
            __typename: "ResetPasswordValidationError",
            tokenError: null,
            passwordError: msg1,
            confirmPasswordError: msg2,
          },
        },
      });
    }

    if (password === pwdStr("verify")) {
      return HttpResponse.json({
        data: {
          resetPassword: {
            __typename: "ResetPasswordValidationError",
            tokenError: "Provide password reset token",
            passwordError: null,
            confirmPasswordError: null,
          },
        },
      });
    }

    if (password === pwdStr("forbid")) {
      return HttpResponse.json({
        data: { resetPassword: { __typename: "ForbiddenError" } },
      });
    }

    if (password === pwdStr("success")) {
      return HttpResponse.json({
        data: { resetPassword: { __typename: "Response" } },
      });
    }

    if (password === pwdStr("network")) return HttpResponse.error();

    if (password === pwdStr("graphql")) {
      return HttpResponse.json({ errors: [new GraphQLError(errorMessage)] });
    }

    if (password === pwdStr("unsupported")) {
      await delay(80);
      return HttpResponse.json({
        data: { resetPassword: { __typename: "UnsupportedType" } },
      });
    }

    return HttpResponse.json();
  }
);

export const validate1 = pwdStr("validate1");
const verify = pwdStr("verify");
const forbid = pwdStr("forbid");
export const success = pwdStr("success");
const network = pwdStr("network");
const gql = pwdStr("graphql");
export const unsupported = pwdStr("unsupported");

const text = "Expect a redirect to the forgot password page if the";
export const redirects: Array<[string, string, string]> = [
  [`${text} reset token could not be verified`, "error", verify],
  [`${text} password reset token could not be verified`, "error", forbid],
  [`${text} API request failed with a network error`, "network", network],
  [`${text} API responded with a graphql error`, "error", gql],
];
