import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { REGISTER_USER } from "../operations/REGISTER_USER";
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
export const invalidFirstName = "First name cannot contain numbers";
export const invalidLastName = "Last name cannot contain numbers";
export const shortPassword = "Password must be at least 8 characters long";

export const invalidPassword =
  "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

const MESSAGE =
  "You are unable to register your account. Please try again later";

export const server = setupServer(
  graphql.mutation(REGISTER_USER, async ({ variables: { userInput } }) => {
    const { password } = userInput as { password: string };

    await delay();

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

const text = "Should display an alert toast message if the api";
export const alerts: [string, Mock<string>][] = [
  [`${text} throws a graphql error`, gql],
  [`${text} failed with a network error`, network],
  [`${text} responded with an unsupported object type`, unsupported],
];

export const errorRedirects: [string, string, Mock][] = [
  [
    "Should redirect the user to the login page if the user is not logged in",
    "/login?status=unauthenticated",
    auth,
  ],
  [
    "Should redirect the user to the login page if the user's credentials could not be verified",
    "/login?status=unauthorized",
    unknown,
  ],
  [
    "Should redirect the user to the home(dashboard) page if the user has already registered their account",
    "/?status=registered",
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
