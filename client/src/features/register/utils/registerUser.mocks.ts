import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { REGISTER_USER } from "../operations/REGISTER_USER";

type SorN = string | null;

interface Errors<T, U, V, X> {
  firstNameError: T;
  lastNameError: U;
  passwordError: V;
  confirmPasswordError: X;
}

interface Expected {
  message: string;
  gql: () => MockedResponse[];
}

export const SESSIONID = "USER_SESSION_ID";
export const FIRST_NAME = "FIRST_NAME";
export const LAST_NAME = "LAST_NAME";
export const PASSWORD = "Pass#W0rd";
export const invalidFirstName = "First name cannot contain numbers";
export const invalidLastName = "Last name cannot contain numbers";
export const shortPassword = "Password must be at least 8 characters long";
export const invalidPassword =
  "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

const USER_ID = "SOME_RANDOM_USER_ID";
const E_MAIL = "user_mail@example.com";
const MESSAGE =
  "You are unable to register your account. Please try again later";
const request = {
  query: REGISTER_USER,
  variables: {
    userInput: {
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      password: PASSWORD,
      confirmPassword: PASSWORD,
    },
  },
};

class ErrorMock {
  constructor(readonly message: string, readonly typename: string) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            registerUser: {
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

class ValidationMock<
  T extends SorN,
  U extends SorN,
  V extends SorN,
  X extends SorN
> {
  constructor(readonly errors: Errors<T, U, V, X>) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            registerUser: {
              __typename: "RegisterUserValidationError",
              firstNameError: this.errors.firstNameError,
              lastNameError: this.errors.lastNameError,
              passwordError: this.errors.passwordError,
              confirmPasswordError: this.errors.confirmPasswordError,
              status: "ERROR",
            },
          },
        },
      },
    ];
  }
}

const auth = new ErrorMock("User is not logged in", "AuthenticationError");
const unknown = new ErrorMock("User session unknown", "UnknownError");
const registered = new ErrorMock("User is registered", "RegistrationError");
const unsupported = new ErrorMock(MESSAGE, "UnsupportedObjectType");

export const validationOne = new ValidationMock({
  firstNameError: "Enter first name",
  lastNameError: "Enter last name",
  passwordError: "Enter password",
  confirmPasswordError: null,
});

export const validationTwo = new ValidationMock({
  firstNameError: "First name cannot contain numbers",
  lastNameError: "Last name cannot contain numbers",
  passwordError: "Password must be at least 8 characters long",
  confirmPasswordError: "Passwords do not match",
});

export const success = {
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            registerUser: {
              __typename: "RegisteredUser",
              user: {
                __typename: "User",
                dateCreated: new Date().toISOString(),
                email: E_MAIL,
                firstName: FIRST_NAME,
                id: USER_ID,
                image: null,
                isRegistered: true,
                lastName: LAST_NAME,
              },
              status: "SUCCESS",
            },
          },
        },
      },
    ];
  },
};

const network = {
  message: MESSAGE,
  gql(): MockedResponse[] {
    return [
      { request, error: new Error("Server responded with a network error") },
    ];
  },
};

const graphql = {
  message: MESSAGE,
  gql(): MockedResponse[] {
    return [{ request, result: { errors: [new GraphQLError(this.message)] } }];
  },
};

export const table1: [string, Expected][] = [
  ["Response resolves to a graphql error", graphql],
  ["Request resolved with a network error", network],
  ["Response is an unsupported object", unsupported],
];

interface ErrorTests {
  path: string;
  expected: ErrorMock;
}

export const table2: [string, string, ErrorTests][] = [
  [
    "login",
    "is not logged in",
    { path: "/login?status=unauthenticated", expected: auth },
  ],
  [
    "login",
    "credentials and user session could not be verified",
    { path: "/login?status=unauthorized", expected: unknown },
  ],
  [
    "home(dashboard)",
    "has already registered their account",
    { path: "/?status=registered", expected: registered },
  ],
];
