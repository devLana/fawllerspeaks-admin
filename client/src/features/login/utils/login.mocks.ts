import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { LOGIN_USER } from "../operations/LOGIN_USER";

interface Input {
  email: string;
  password: string;
}

interface ExpectedError extends Input {
  message: string;
  gql: () => MockedResponse[];
}

const EMAIL = "login_test@mail.com";
const PASSWORD = "testPassword";
const msg = "You are unable to login at the moment. Please try again later";

const request = (
  email: string,
  password: string
): MockedResponse["request"] => {
  return { query: LOGIN_USER, variables: { email, password } };
};

export const validation = {
  email: `validation_${EMAIL}`,
  password: `validation_${PASSWORD}`,
  emailError: "Invalid e-mail address",
  passwordError: "Enter Password",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email, this.password),
        result: {
          data: {
            login: {
              __typename: "LoginValidationError",
              emailError: this.emailError,
              passwordError: this.passwordError,
            },
          },
        },
      },
    ];
  },
};

class ErrorMock {
  email: string;
  password: string;

  constructor(
    input: Input,
    readonly typename: string,
    readonly message: string
  ) {
    this.email = `${input.email}_${EMAIL}`;
    this.password = `${input.password}_${PASSWORD}`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email, this.password),
        result: {
          data: { login: { __typename: this.typename, message: this.message } },
        },
      },
    ];
  }
}

const unrecognized = new ErrorMock(
  { email: "unrecognized", password: "unrecognized" },
  "NotAllowedError",
  "Invalid email or password"
);

const emailPasswordError = new ErrorMock(
  { email: "email_password", password: "email_password" },
  "NotAllowedError",
  "Invalid email or password"
);

const unsupported = {
  email: `unsupported_${EMAIL}`,
  password: `unsupported_${PASSWORD}`,
  message: msg,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email, this.password),
        result: { data: { login: { __typename: "UnknownGraphqlObjectType" } } },
      },
    ];
  },
};

class SuccessMock {
  sessionId: string;
  email: string;
  password: string;

  constructor(input: Input, readonly isRegistered: boolean) {
    this.sessionId = "USER_DATA_SESSION_ID";
    this.email = `${input.email}_${EMAIL}`;
    this.password = `${input.password}_${PASSWORD}`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email, this.password),
        result: {
          data: {
            login: {
              __typename: "LoggedInUser",
              accessToken: "accessToken",
              sessionId: this.sessionId,
              user: {
                __typename: "User",
                id: "user_id",
                email: "mail@example.com",
                firstName: "first name",
                lastName: "last Name",
                image: null,
                isRegistered: this.isRegistered,
              },
            },
          },
        },
      },
    ];
  }
}

const registered = new SuccessMock(
  { email: "registered", password: "registered" },
  true
);
const unRegistered = new SuccessMock(
  { email: "unregistered", password: "unregistered" },
  false
);

const graphql = {
  message: "Server responded with a graphql error",
  email: `graphql_${EMAIL}`,
  password: `graphql_${PASSWORD}`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email, this.password),
        result: { errors: [new GraphQLError(this.message)] },
      },
    ];
  },
};

const network = {
  message: msg,
  email: `network_${EMAIL}`,
  password: `network_${PASSWORD}`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.email, this.password),
        error: new Error(this.message),
      },
    ];
  },
};

export const errorTable: [string, ExpectedError][] = [
  ["email is unrecognized by the server", unrecognized],
  ["email and password do not match", emailPasswordError],
  ["server responds with a network error", network],
  ["server responds with a graphql error", graphql],
  ["server response is an unsupported object type", unsupported],
];

interface ExpectedSuccess {
  mock: SuccessMock;
  page: string;
}

export const successTable: [string, ExpectedSuccess][] = [
  [
    "Redirect unregistered user to the register page",
    { mock: unRegistered, page: "/register" },
  ],
  [
    "Redirect registered user to the dashboard/home page",
    { mock: registered, page: "/" },
  ],
];

export const redirectStatus: [string, string][] = [
  [
    "Display an alert message if user attempted an unauthorized action",
    "unauthorized",
  ],
  ["Display an alert message if user is unauthenticated", "unauthenticated"],
];
