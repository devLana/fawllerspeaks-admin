import { GraphQLError } from "graphql";
import { graphql } from "msw";
import { setupServer } from "msw/node";
import type { MockedResponse } from "@apollo/client/testing";

import { RESET_PASSWORD } from "../operations/RESET_PASSWORD";

const VERIFIED_PASSWORD_RESET_TOKEN = "VERIFIED_PASSWORD_RESET_TOKEN";

/* GetServerSideProps Verify Password Reset Token Mocks */
const INVALID_RESET_TOKEN = "INVALID_RESET_TOKEN";
const UNKNOWN_EXPIRED_RESET_TOKEN = "UNKNOWN_EXPIRED_RESET_TOKEN";
const UNSUPPORTED_RESPONSE_RESET_TOKEN = "UNSUPPORTED_RESPONSE_RESET_TOKEN";
const GRAPHQL_ERROR_RESET_TOKEN = "GRAPHQL_ERROR_RESET_TOKEN";
const NETWORK_ERROR_RESET_TOKEN = "NETWORK_ERROR_RESET_TOKEN";
const UNREGISTERED_RESET_TOKEN = "UNREGISTERED_RESET_TOKEN";
const EMAIL = "reset_password_test@mail.org";

export const server = setupServer(
  graphql.mutation("VerifyResetToken", (req, res, ctx) => {
    const { token } = req.variables;

    if (token === INVALID_RESET_TOKEN) {
      return res(
        ctx.data({
          verifyResetToken: { __typename: "VerifyResetTokenValidationError" },
        })
      );
    }

    if (token === UNKNOWN_EXPIRED_RESET_TOKEN) {
      return res(
        ctx.data({ verifyResetToken: { __typename: "NotAllowedError" } })
      );
    }

    if (token === UNREGISTERED_RESET_TOKEN) {
      return res(
        ctx.data({ verifyResetToken: { __typename: "RegistrationError" } })
      );
    }

    if (token === VERIFIED_PASSWORD_RESET_TOKEN) {
      return res(
        ctx.data({
          verifyResetToken: {
            __typename: "VerifiedResetToken",
            email: EMAIL,
            resetToken: VERIFIED_PASSWORD_RESET_TOKEN,
          },
        })
      );
    }

    if (token === UNSUPPORTED_RESPONSE_RESET_TOKEN) {
      return res(
        ctx.data({ verifyResetToken: { __typename: "UnsupportedObjectType" } })
      );
    }

    if (token === GRAPHQL_ERROR_RESET_TOKEN) {
      return res(
        ctx.errors([new GraphQLError("Unable to verify reset token")])
      );
    }

    return res(ctx.status(404));
  })
);

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

export const verifyErrorObjects: [string, string, string][] = [
  [
    "Password reset token is invalid",
    "/forgot-password?status=validation",
    INVALID_RESET_TOKEN,
  ],
  [
    "Password reset token is unknown or has expired",
    "/forgot-password?status=fail",
    UNKNOWN_EXPIRED_RESET_TOKEN,
  ],
  [
    "Verification returned an unsupported object type",
    "/forgot-password?status=unsupported",
    UNSUPPORTED_RESPONSE_RESET_TOKEN,
  ],
];

export const verifyErrors: [string, string, string][] = [
  [
    "Verification request returns a network error",
    NETWORK_ERROR_RESET_TOKEN,
    "network",
  ],
  [
    "Verification request returns a graphql error",
    GRAPHQL_ERROR_RESET_TOKEN,
    "api",
  ],
];

export const verified = {
  email: EMAIL,
  resetToken: VERIFIED_PASSWORD_RESET_TOKEN,
};

interface UnRegisteredProps {
  isUnregistered: true;
}

interface VerifiedProps {
  verified: { email: string; resetToken: string };
}

interface Dict {
  token: string;
  props: UnRegisteredProps | VerifiedProps;
}

export const verifyProps: [string, string, Dict][] = [
  [
    "Verification fails for an unregistered user",
    "Return an 'isUnregistered' props",
    { token: UNREGISTERED_RESET_TOKEN, props: { isUnregistered: true } },
  ],
  [
    "Password reset token is verified",
    "Return a 'verified' props",
    { token: VERIFIED_PASSWORD_RESET_TOKEN, props: { verified } },
  ],
];

/* Reset Password Mocks */
type SorN = string | null;

interface ValidationErrors<T extends SorN, U extends SorN, V extends SorN> {
  tokenError: T;
  passwordError: U;
  confirmPasswordError: V;
}

interface Data {
  typename: string;
  status?: "ERROR" | "SUCCESS" | "WARN";
}

interface Tables {
  gql: () => MockedResponse[];
  password: string;
}

export const msg =
  "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

const PASSWORD = "Pass!W0rd";
const errorMessage = "Unable to verify password reset token";
const request = (password: string): MockedResponse["request"] => {
  return {
    query: RESET_PASSWORD,
    variables: {
      token: VERIFIED_PASSWORD_RESET_TOKEN,
      password,
      confirmPassword: password,
    },
  };
};

class ResetValidationMocks<T extends SorN, U extends SorN, V extends SorN> {
  password: string;
  tokenError: T;
  passwordError: U;
  confirmPasswordError: V;

  constructor(name: string, errors: ValidationErrors<T, U, V>) {
    this.password = `${name}_${PASSWORD}`;
    this.tokenError = errors.tokenError;
    this.passwordError = errors.passwordError;
    this.confirmPasswordError = errors.confirmPasswordError;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.password),
        result: {
          data: {
            resetPassword: {
              __typename: "ResetPasswordValidationError",
              tokenError: this.tokenError,
              passwordError: this.passwordError,
              confirmPasswordError: this.confirmPasswordError,
            },
          },
        },
      },
    ];
  }
}

class ResetMocks {
  password: string;
  typename: string;
  status: "ERROR" | "SUCCESS" | "WARN";

  constructor(name: string, data: Data) {
    this.password = `${name}_${PASSWORD}`;
    this.typename = data.typename;
    this.status = data.status ?? "ERROR";
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.password),
        result: {
          data: {
            resetPassword: { __typename: this.typename, status: this.status },
          },
        },
      },
    ];
  }
}

export const resetValidation1 = new ResetValidationMocks("validationOne", {
  tokenError: null,
  passwordError: "Password must be at least 8 characters long",
  confirmPasswordError: "Passwords do not match",
});

const resetValidation2 = new ResetValidationMocks("validationTwo", {
  tokenError: "Provide password reset token",
  passwordError: null,
  confirmPasswordError: null,
});

const resetUnsupported = new ResetMocks("unsupported", {
  typename: "UnsupportedObjectType",
});

const resetNotAllowed = new ResetMocks("notAllowed", {
  typename: "NotAllowedError",
});

export const resetUnregistered = new ResetMocks("unregistered", {
  typename: "RegistrationError",
});

const resetSuccess = new ResetMocks("success", {
  typename: "Response",
  status: "SUCCESS",
});

const resetWarn = new ResetMocks("resetWarn", {
  typename: "Response",
  status: "WARN",
});

const resetNetwork = {
  password: `network_${PASSWORD}`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.password),
        error: new Error("Server responded with a network error"),
      },
    ];
  },
};

const resetGraphql = {
  password: `graphql_${PASSWORD}`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.password),
        result: { errors: [new GraphQLError(errorMessage)] },
      },
    ];
  },
};

export const resetTableOne: [string, string, Tables][] = [
  [
    "Redirect to forgot password page if sever responds with a token validation error",
    "validation",
    resetValidation2,
  ],
  [
    "Redirect to forgot password page if sever responds with a network error",
    "network",
    resetNetwork,
  ],
  [
    "Redirect to forgot password page if sever responds with an unsupported object type",
    "unsupported",
    resetUnsupported,
  ],
];

export const resetTableTwo: [string, string, Tables][] = [
  [
    "Redirect to forgot password page if password reset token is unknown or has expired",
    "fail",
    resetNotAllowed,
  ],
  [
    "Redirect to forgot password page if server responds with a graphql error",
    "api",
    resetGraphql,
  ],
];

export const resetTableThree: [string, string, Tables][] = [
  [
    "a success dialog box if status is 'SUCCESS'",
    "MuiAlert-standardSuccess",
    resetSuccess,
  ],
  [
    "an information dialog box if status is 'WARN'",
    "MuiAlert-standardInfo",
    resetWarn,
  ],
];
