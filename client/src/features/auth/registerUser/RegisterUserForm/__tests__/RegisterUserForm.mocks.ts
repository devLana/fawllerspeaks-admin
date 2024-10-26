import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";
import { screen } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

import { REGISTER_USER } from "@mutations/registerUser/REGISTER_USER";
import { mswData, mswErrors } from "@utils/tests/msw";

export interface Input {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const passwordStr = (prefix: string) => `${prefix}_p@55W0rd`;
const FIRST_NAME = "FIRST_NAME";
const LAST_NAME = "LAST_NAME";
export const invalidFirstName = "First name contains an invalid character";
export const invalidLastName = "Last name contains an invalid character";
export const shortPassword = "Password must be at least 8 characters long";

export const invalidPassword =
  "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

const MESSAGE =
  "You are unable to register your account. Please try again later";

export const server = setupServer(
  graphql.mutation(REGISTER_USER, async ({ variables: { userInput } }) => {
    const { password } = userInput as { password: string };

    await delay(50);

    if (password === passwordStr("auth")) {
      return mswData("registerUser", "AuthenticationError");
    }

    if (password === passwordStr("unknown")) {
      return mswData("registerUser", "UnknownError");
    }

    if (password === passwordStr("registered")) {
      return mswData("registerUser", "RegistrationError");
    }

    if (password === passwordStr("unsupported")) {
      return mswData("registerUser", "UnsupportedType");
    }

    if (password === passwordStr("validation")) {
      return mswData("registerUser", "RegisterUserValidationError", {
        firstNameError: invalidFirstName,
        lastNameError: invalidLastName,
        passwordError: shortPassword,
        confirmPasswordError: "Passwords do not match",
      });
    }

    if (password === passwordStr("success")) {
      return mswData("registerUser", "RegisteredUser", {
        user: {
          __typename: "User",
          id: "SOME_RANDOM_USER_ID",
          email: "user_mail@example.com",
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          image: null,
          isRegistered: true,
        },
      });
    }

    if (password === passwordStr("graphql")) {
      return mswErrors(new GraphQLError(MESSAGE));
    }

    if (password === passwordStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

class Mock<T extends string | undefined = undefined> {
  input: Input;

  constructor(prefix: string, readonly message: T) {
    this.input = {
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      password: passwordStr(prefix),
      confirmPassword: passwordStr(prefix),
    };
  }
}

export const validation = new Mock("validation", undefined);
const success = new Mock("success", undefined);
const auth = new Mock("auth", undefined);
const unknown = new Mock("unknown", undefined);
const registered = new Mock("registered", undefined);
const unsupported = new Mock("unsupported", MESSAGE);
const network = new Mock("network", MESSAGE);
const gql = new Mock("graphql", MESSAGE);

const text = "Should display an alert toast message if the API";
export const alerts: [string, Mock<string>][] = [
  [`${text} throws a graphql error`, gql],
  [`${text} failed with a network error`, network],
  [`${text} responded with an unsupported object type`, unsupported],
];

interface Params {
  pathname: string;
  query: Record<string, string>;
}

export const errorRedirects: [string, Params, Mock][] = [
  [
    "Should redirect the user to the login page if the user is not logged in",
    { pathname: "/login", query: { status: "unauthenticated" } },
    auth,
  ],
  [
    "Should redirect the user to the login page if the user's credentials could not be verified",
    { pathname: "/login", query: { status: "unauthorized" } },
    unknown,
  ],
  [
    "Should redirect the user to the home(dashboard) page if the user has already registered their account",
    { pathname: "/", query: { status: "registered" } },
    registered,
  ],
];

interface Query {
  query: { redirectTo: string } | Record<string, never>;
  page: string;
}

export const successRedirects: [string, Query, Mock][] = [
  [
    "Should redirect the user to the home(dashboard) page",
    { query: {}, page: "/" },
    success,
  ],
  [
    "Should redirect the user based on the value of the 'redirectTo' url query",
    { query: { redirectTo: "/post-tags" }, page: "/post-tags" },
    success,
  ],
  [
    "Should redirect the user to the home(dashboard) page if the value of the 'redirectTo' url query is not allowed",
    { query: { redirectTo: "forgot-password" }, page: "/" },
    success,
  ],
];

export const dryEvents = async (user: UserEvent, input: Input) => {
  await user.type(
    screen.getByRole("textbox", { name: /^first name$/i }),
    input.firstName
  );

  await user.type(
    screen.getByRole("textbox", { name: /^last name$/i }),
    input.lastName
  );

  await user.type(screen.getByLabelText(/^password$/i), input.password);
  await user.type(screen.getByLabelText(/^confirm password$/i), input.password);
  await user.click(screen.getByRole("button", { name: /^register$/i }));

  expect(screen.getByRole("button", { name: /^register$/i })).toBeDisabled();
};
