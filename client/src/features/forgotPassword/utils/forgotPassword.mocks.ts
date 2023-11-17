import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { FORGOT_PASSWORD } from "../operations/FORGOT_PASSWORD";

interface Expected {
  message: string;
  gql: () => MockedResponse[];
  email: string;
}

const EMAIL = "forgot_password_email@example.org";
const request = (email: string): MockedResponse["request"] => {
  return { query: FORGOT_PASSWORD, variables: { email } };
};

class MocksOne {
  email: string;

  constructor(
    mail: string,
    readonly typename: string,
    readonly message: string
  ) {
    this.email = `${mail}_${EMAIL}`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email),
        result: {
          data: {
            forgotPassword: {
              __typename: this.typename,
              message: this.message,
            },
          },
        },
      },
    ];
  }
}

class MocksTwo {
  email: string;

  constructor(mail: string, readonly typename: string, readonly message = "") {
    this.email = `${mail}_${EMAIL}`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email),
        result: { data: { forgotPassword: { __typename: this.typename } } },
      },
    ];
  }
}

const notAllowed = new MocksOne(
  "not_allowed",
  "NotAllowedError",
  "Unknown email address provided"
);

const server = new MocksOne(
  "server",
  "ServerError",
  "Unable to send password reset link at this time"
);

export const registration = new MocksTwo("registration", "RegistrationError");

export const unsupported = new MocksTwo(
  "unsupported",
  "UnsupportedObjectType",
  "You are unable to reset your password at the moment. Please try again later"
);

export const validation = {
  email: `validation_${EMAIL}`,
  emailError: "Invalid e-mail address server response",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email),
        result: {
          data: {
            forgotPassword: {
              __typename: "EmailValidationError",
              emailError: this.emailError,
            },
          },
        },
      },
    ];
  },
};

const graphql = {
  message: "Server responded with a graphql error",
  email: `graphql_${EMAIL}`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email),
        result: { errors: [new GraphQLError(this.message)] },
      },
    ];
  },
};

const network = {
  message:
    "You are unable to reset your password at the moment. Please try again later",
  email: `network_${EMAIL}`,
  gql(): MockedResponse[] {
    return [{ request: request(this.email), error: new Error(this.message) }];
  },
};

export const success = {
  message: "Password request link has been sent to the email address provided",
  email: `success_${EMAIL}`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email),
        result: { data: { forgotPassword: { __typename: "Response" } } },
      },
    ];
  },
};

export const testTable: [string, Expected][] = [
  ["email does not match a valid account on the server", notAllowed],
  ["server response is a server error object", server],
  ["server responds with a network error", network],
  ["server responds with a graphql error", graphql],
];

const message = "Unable to verify password reset token";

export const statusTable: [string, string, string][] = [
  [
    "Display an alert message if an empty password reset token string is provided",
    "empty",
    "A password reset token is needed to reset an account password",
  ],
  [
    "Display an alert message if a malformed password reset token string is provided",
    "invalid",
    "Invalid password reset token",
  ],
  [
    "Display an alert message if a password reset token validation error occurs",
    "validation",
    "Invalid password reset token",
  ],
  [
    "Display an alert message if the password reset token is unknown or has expired",
    "fail",
    message,
  ],
  [
    "Display an alert message if password reset token verification response is an unsupported object",
    "unsupported",
    message,
  ],
  [
    "Display an alert message if a graphql error occurs while verifying the password reset token ",
    "api",
    message,
  ],
  [
    "Display an alert message if a network error prevents the password reset token verification",
    "network",
    `${message}. Please try again later`,
  ],
];
