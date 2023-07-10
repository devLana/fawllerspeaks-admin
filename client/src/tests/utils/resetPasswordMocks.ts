import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { RESET_PASSWORD } from "@features/resetPassword/mutations/RESET_PASSWORD";

const VERIFIED_PASSWORD_RESET_TOKEN = "VERIFIED_PASSWORD_RESET_TOKEN";

/* GetServerSideProps Verify Password Reset Token Mocks */
export const verifyValidate: [string, string | string[], string][] = [
  [
    "Return a redirect object if there is no password reset token in the query params object",
    "",
    "empty",
  ],
  [
    "Return a redirect object if there are multiple password reset tokens in the query params object",
    ["token_one", "token_two"],
    "invalid",
  ],
];

export const verifyErrorObjects: [string, { __typename: string }, string][] = [
  [
    "Password reset token is invalid",
    { __typename: "VerifyResetTokenValidationError" },
    "/forgot-password?status=validation",
  ],
  [
    "Password reset token is unknown or has expired",
    { __typename: "NotAllowedError" },
    "/forgot-password?status=fail",
  ],
  [
    "Verification returned an unsupported object type",
    { __typename: "UnsupportedObjectType" },
    "/forgot-password?status=unsupported",
  ],
];

export const verifyErrors: [string, undefined | GraphQLError[], string][] = [
  ["Verification request returns a network error", undefined, "network"],
  [
    "Verification request returns a graphql error",
    [new GraphQLError("GraphQL error")],
    "api",
  ],
];

export const verified = {
  email: "reset_password_test@mail.org",
  resetToken: VERIFIED_PASSWORD_RESET_TOKEN,
};

interface UnregisteredData {
  [key: string]: string;
  __typename: "RegistrationError";
}

interface VerifiedData {
  [key: string]: string;
  __typename: "VerifiedResetToken";
  email: string;
  resetToken: string;
}

interface UnRegisteredProps {
  isUnregistered: true;
}

interface VerifiedProps {
  verified: { email: string; resetToken: string };
}

interface Dict {
  data: UnregisteredData | VerifiedData;
  props: UnRegisteredProps | VerifiedProps;
}

export const verifyProps: [string, string, Dict][] = [
  [
    "Verification fails for an unregistered user",
    "Return an 'isUnregistered' props",
    {
      data: { __typename: "RegistrationError" },
      props: { isUnregistered: true },
    },
  ],
  [
    "Password reset token is verified",
    "Return a 'verified' props",
    {
      data: { __typename: "VerifiedResetToken", ...verified },
      props: { verified },
    },
  ],
];

/* Reset Password Mocks */
type SorN = string | null;

const errorMessage = "Unable to verify password reset token";
export const PASSWORD = "Pass!W0rd";
const request: MockedResponse["request"] = {
  query: RESET_PASSWORD,
  variables: {
    token: VERIFIED_PASSWORD_RESET_TOKEN,
    password: PASSWORD,
    confirmPassword: PASSWORD,
  },
};

class ResetValidationMocks<T extends SorN, U extends SorN, V extends SorN> {
  constructor(
    readonly tokenError: T,
    readonly passwordError: U,
    readonly confirmPasswordError: V
  ) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            resetPassword: {
              __typename: "ResetPasswordValidationError",
              tokenError: this.tokenError,
              passwordError: this.passwordError,
              confirmPasswordError: this.confirmPasswordError,
              status: "ERROR",
            },
          },
        },
      },
    ];
  }
}

class ResetMocks {
  constructor(
    readonly message: string,
    readonly typename: string,
    readonly status = "ERROR"
  ) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            resetPassword: {
              __typename: this.typename,
              message: this.message,
              status: this.status,
            },
          },
        },
      },
    ];
  }
}

export const resetValidationOne = new ResetValidationMocks(
  null,
  "Password must be at least 8 characters long",
  "Passwords do not match"
);

const resetValidationTwo = new ResetValidationMocks(
  "Provide password reset token",
  null,
  null
);

const resetUnsupported = new ResetMocks(
  "Unsupported object type",
  "UnsupportedObjectType"
);

const resetNotAllowed = new ResetMocks(errorMessage, "NotAllowedError");

export const resetUnregistered = new ResetMocks(
  errorMessage,
  "RegistrationError"
);

const resetSuccess = new ResetMocks(
  "Password Reset SuccessFul",
  "Response",
  "SUCCESS"
);

const resetWarn = new ResetMocks(
  "Password reset successFul but mail not sent",
  "Response",
  "WARN"
);

const resetNetwork = {
  gql(): MockedResponse[] {
    return [
      { request, error: new Error("Server responded with a network error") },
    ];
  },
};

const resetGraphql = {
  gql(): MockedResponse[] {
    return [{ request, result: { errors: [new GraphQLError(errorMessage)] } }];
  },
};

export const resetTableOne: [string, string, MockedResponse[]][] = [
  ["a token validation error", "validation", resetValidationTwo.gql()],
  ["a network error", "network", resetNetwork.gql()],
  ["an unsupported object type", "unsupported", resetUnsupported.gql()],
];

export const resetTableTwo: [string, string, MockedResponse[]][] = [
  [
    "password reset token is unknown or has expired",
    "fail",
    resetNotAllowed.gql(),
  ],
  ["server responds with a graphql error", "api", resetGraphql.gql()],
];

export const resetTableThree: [string, string, MockedResponse[]][] = [
  [
    "a success dialog box if status is 'SUCCESS'",
    "MuiAlert-standardSuccess",
    resetSuccess.gql(),
  ],
  [
    "an information dialog box if status is 'WARN'",
    "MuiAlert-standardInfo",
    resetWarn.gql(),
  ],
];
