import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { FORGOT_PASSWORD } from "@mutations/auth/forgotPassword";

export const box = { name: /e-?mail/i };
export const btn = { name: /Get Reset Link/i };
const emailStr = (label: string) => `${label}_email@example.org`;
const emailError = "Invalid e-mail address server response";
const msg1 = "Unable to send password reset link at this time";
const msg2 = "Unknown email address provided";
const msg3 = `The server is currently unreachable. Please try again later`;
const msg4 = "Server responded with a graphql error";
const MSG = `You are unable to reset your password at this time. Please try again later`;

const mock = <T extends string | undefined>(label: string, message: T) => {
  const email = emailStr(label);
  return { email, message };
};

export const validation = mock("validation", emailError);
export const ok = mock("success", undefined);
export const unsupported = mock("unsupported", MSG);
const serverError = mock("server_error", msg1);
const forbid = mock("forbid", msg2);
const network = mock("network", msg3);
const gql = mock("graphql", msg4);

const text = "Expect an alert message toast if";
export const testTable: Array<[string, ReturnType<typeof mock<string>>]> = [
  [
    `${text} there was an error responding to a password reset token request`,
    forbid,
  ],
  [`${text} the API response is a server error`, serverError],
  [`${text} the API response is a graphql error`, gql],
  [`${text} the request fails with a network error`, network],
];

export const forgotPasswordHandler = graphql.mutation(
  FORGOT_PASSWORD,
  async ({ variables }) => {
    if (variables.email === emailStr("server_error")) {
      return HttpResponse.json({
        data: { forgotPassword: { __typename: "ServerError", message: msg1 } },
      });
    }

    if (variables.email === emailStr("forbid")) {
      return HttpResponse.json({
        data: {
          forgotPassword: { __typename: "ForbiddenError", message: msg2 },
        },
      });
    }

    if (variables.email === emailStr("validation")) {
      return HttpResponse.json({
        data: {
          forgotPassword: { __typename: "EmailValidationError", emailError },
        },
      });
    }

    if (variables.email === emailStr("success")) {
      return HttpResponse.json({
        data: { forgotPassword: { __typename: "Response" } },
      });
    }

    if (variables.email === emailStr("network")) return HttpResponse.error();

    if (variables.email === emailStr("graphql")) {
      return HttpResponse.json({ errors: [new GraphQLError(msg4)] });
    }

    if (variables.email === emailStr("unsupported")) {
      await delay(80);
      return HttpResponse.json({
        data: { forgotPassword: { __typename: "UnsupportedType" } },
      });
    }

    return HttpResponse.json();
  }
);
