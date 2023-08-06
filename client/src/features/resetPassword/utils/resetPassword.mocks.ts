import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { RESET_PASSWORD } from "../operations/RESET_PASSWORD";

const VERIFIED_PASSWORD_RESET_TOKEN = "VERIFIED_PASSWORD_RESET_TOKEN";

/* GetServerSideProps Verify Password Reset Token Mocks */
export interface MutateResult {
  data?: { verifyResetToken: Record<string, string> };
  errors?: unknown[];
}

interface VerifyErrorObjects {
  verifyResetToken: { __typename: string };
}

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

export const verifyErrorObjects: [string, VerifyErrorObjects, string][] = [
  [
    "Password reset token is invalid",
    { verifyResetToken: { __typename: "VerifyResetTokenValidationError" } },
    "/forgot-password?status=validation",
  ],
  [
    "Password reset token is unknown or has expired",
    { verifyResetToken: { __typename: "NotAllowedError" } },
    "/forgot-password?status=fail",
  ],
  [
    "Verification returned an unsupported object type",
    { verifyResetToken: { __typename: "UnsupportedObjectType" } },
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
  data: { verifyResetToken: UnregisteredData | VerifiedData };
  props: UnRegisteredProps | VerifiedProps;
}

export const verifyProps: [string, string, Dict][] = [
  [
    "Verification fails for an unregistered user",
    "Return an 'isUnregistered' props",
    {
      data: { verifyResetToken: { __typename: "RegistrationError" } },
      props: { isUnregistered: true },
    },
  ],
  [
    "Password reset token is verified",
    "Return a 'verified' props",
    {
      data: {
        verifyResetToken: { __typename: "VerifiedResetToken", ...verified },
      },
      props: { verified },
    },
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
  message: string;
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
              status: "ERROR",
            },
          },
        },
      },
    ];
  }
}

class ResetMocks {
  password: string;
  message: string;
  typename: string;
  status: "ERROR" | "SUCCESS" | "WARN";

  constructor(name: string, data: Data) {
    this.password = `${name}_${PASSWORD}`;
    this.message = data.message;
    this.typename = data.typename;
    this.status = data.status ?? "ERROR";
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.password),
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
  message: "Unsupported object type",
  typename: "UnsupportedObjectType",
});

const resetNotAllowed = new ResetMocks("notAllowed", {
  message: errorMessage,
  typename: "NotAllowedError",
});

export const resetUnregistered = new ResetMocks("unregistered", {
  message: errorMessage,
  typename: "RegistrationError",
});

const resetSuccess = new ResetMocks("success", {
  message: "Password Reset SuccessFul",
  typename: "Response",
  status: "SUCCESS",
});

const resetWarn = new ResetMocks("resetWarn", {
  message: "Password reset successFul but mail not sent",
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
