import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { REGISTER_USER } from "../operations/REGISTER_USER";

type SorN = string | null;

export interface Input {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface Errors<T, U, V, X> {
  firstNameError: T;
  lastNameError: U;
  passwordError: V;
  confirmPasswordError: X;
}

interface Expected {
  message: string;
  gql: () => MockedResponse[];
  input: Input;
}

export const invalidFirstName = "First name cannot contain numbers";
export const invalidLastName = "Last name cannot contain numbers";
export const shortPassword = "Password must be at least 8 characters long";
export const invalidPassword =
  "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

const FIRST_NAME = "FIRST_NAME";
const LAST_NAME = "LAST_NAME";
const USER_ID = "SOME_RANDOM_USER_ID";
const E_MAIL = "user_mail@example.com";
const MESSAGE =
  "You are unable to register your account. Please try again later";

const request = (input: Input): MockedResponse["request"] => {
  return { query: REGISTER_USER, variables: { userInput: input } };
};

const inputs = (name: string): Input => ({
  firstName: `${name}_${FIRST_NAME}`,
  lastName: `${name}_${LAST_NAME}`,
  password: `${name}_Pass#W0rd`,
  confirmPassword: `${name}_Pass#W0rd`,
});

class ErrorMock {
  constructor(
    readonly input: Input,
    readonly message: string,
    readonly typename: string
  ) {}

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
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
  constructor(readonly input: Input, readonly errors: Errors<T, U, V, X>) {}

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
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

const auth = new ErrorMock(
  inputs("auth"),
  "User is not logged in",
  "AuthenticationError"
);

const unknown = new ErrorMock(
  inputs("unknown"),
  "User session unknown",
  "UnknownError"
);

const registered = new ErrorMock(
  inputs("registered"),
  "User is registered",
  "RegistrationError"
);

const unsupported = new ErrorMock(
  inputs("unsupported"),
  MESSAGE,
  "UnsupportedObjectType"
);

export const validation1 = new ValidationMock(inputs("validationOne"), {
  firstNameError: "Enter first name",
  lastNameError: "Enter last name",
  passwordError: "Enter password",
  confirmPasswordError: null,
});

export const validation2 = new ValidationMock(inputs("validationTwo"), {
  firstNameError: "First name cannot contain numbers",
  lastNameError: "Last name cannot contain numbers",
  passwordError: "Password must be at least 8 characters long",
  confirmPasswordError: "Passwords do not match",
});

export const success = {
  input: inputs("success"),
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
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
  input: inputs("network"),
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        error: new Error("Server responded with a network error"),
      },
    ];
  },
};

const graphql = {
  message: MESSAGE,
  input: inputs("graphql"),
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        result: { errors: [new GraphQLError(this.message)] },
      },
    ];
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

export const table2: [string, ErrorTests][] = [
  [
    "Redirect the user to the login page if the user is not logged in",
    { path: "/login?status=unauthenticated", expected: auth },
  ],
  [
    "Redirect the user to the login page if the user's credentials could not be verified",
    { path: "/login?status=unauthorized", expected: unknown },
  ],
  [
    "Redirect the user to the home(dashboard) page if the user has already registered their account",
    { path: "/?status=registered", expected: registered },
  ],
];
