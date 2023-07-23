import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { LOGIN_USER } from "@features/login/LOGIN_USER";

interface ExpectedError {
  message: string;
  gql: () => MockedResponse[];
}

export const EMAIL = "login_test@mail.com";
export const PASSWORD = "testPassword";
const msg = "You are unable to login at the moment. Please try again later";
const request: MockedResponse["request"] = {
  query: LOGIN_USER,
  variables: { email: EMAIL, password: PASSWORD },
};

export const validationError = {
  emailError: "Invalid e-mail address",
  passwordError: "Enter Password",
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            login: {
              __typename: "LoginValidationError",
              emailError: this.emailError,
              passwordError: this.passwordError,
              status: "ERROR",
            },
          },
        },
      },
    ];
  },
};

class ErrorMock {
  constructor(readonly typename: string, readonly message: string) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            login: {
              __typename: this.typename,
              message: this.message,
              status: "ERROR",
            },
          },
        },
      },
    ];
  }
}

const unrecognizedEmailError = new ErrorMock(
  "NotAllowedError",
  "Invalid email or password"
);

const emailPasswordError = new ErrorMock(
  "NotAllowedError",
  "Invalid email or password"
);

const unsupportedObjectType = new ErrorMock("UnknownGraphqlObjectType", msg);

class SuccessMock {
  sessionId: string;

  constructor(readonly isRegistered: boolean) {
    this.sessionId = "USER_DATA_SESSION_ID";
  }

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            login: {
              __typename: "LoggedInUser",
              accessToken: "accessToken",
              sessionId: this.sessionId,
              user: {
                __typename: "User",
                dateCreated: new Date().toISOString(),
                email: "mail@example.com",
                firstName: "first name",
                id: "user_id",
                image: null,
                isRegistered: this.isRegistered,
                lastName: "last Name",
              },
              status: "SUCCESS",
            },
          },
        },
      },
    ];
  }
}

const registeredUser = new SuccessMock(true);
const unRegisteredUser = new SuccessMock(false);

const graphqlError = {
  message: "Server responded with a graphql error",
  gql(): MockedResponse[] {
    return [{ request, result: { errors: [new GraphQLError(this.message)] } }];
  },
};

const networkError = {
  message: msg,
  gql(): MockedResponse[] {
    return [{ request, error: new Error(this.message) }];
  },
};

export const loginErrorTable: [string, ExpectedError][] = [
  ["email is unrecognized by the server", unrecognizedEmailError],
  ["email and password do not match", emailPasswordError],
  ["server responds with a network error", networkError],
  ["server responds with a graphql error", graphqlError],
  ["server response is an unsupported object type", unsupportedObjectType],
];

interface ExpectedSuccess {
  mock: SuccessMock;
  page: string;
}

export const loginSuccessTable: [string, string, ExpectedSuccess][] = [
  ["unregistered", "register", { mock: unRegisteredUser, page: "/register" }],
  ["registered", "dashboard/home", { mock: registeredUser, page: "/" }],
];

export const redirectStatus: [string, string][] = [
  [
    "Display an alert message if user attempted an unauthorized action",
    "unauthorized",
  ],
  ["Display an alert message if user is unauthenticated", "unauthenticated"],
];
