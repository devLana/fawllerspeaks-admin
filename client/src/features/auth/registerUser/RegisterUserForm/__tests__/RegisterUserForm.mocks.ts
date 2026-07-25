import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { REGISTER_USER } from "@mutations/auth/registerUser";

export interface Input {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const FIRST_NAME = "FIRST_NAME";
const LAST_NAME = "LAST_NAME";
const MSG = `You cannot register your account at this time. Please try again later`;
const networkMSG = `The server is currently unreachable. Please try again later`;
const gqlMSG = "This is a graphql error message";
const passwordStr = (prefix: string) => `${prefix}_p@55W0rd`;
export const fN = { name: /^first name$/i };
export const lN = { name: /^last name$/i };
export const btn = { name: /^register$/i };
export const pw = /^password$/i;
export const cPw = /^confirm password$/i;
export const invalidFirstName = "First name contains an invalid character";
export const invalidLastName = "Last name contains an invalid character";
export const shortPassword = "Password must be at least 8 characters long";
export const invalidPassword = `Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol`;

export const registerUserHandler = graphql.mutation(
  REGISTER_USER,
  async ({ variables: { userInput } }) => {
    const { password } = userInput;

    if (password === passwordStr("auth")) {
      return HttpResponse.json({
        data: { registerUser: { __typename: "UnauthorizedError" } },
      });
    }

    if (password === passwordStr("registered")) {
      return HttpResponse.json({
        data: { registerUser: { __typename: "RegistrationError" } },
      });
    }

    if (password === passwordStr("validation")) {
      return HttpResponse.json({
        data: {
          registerUser: {
            __typename: "RegisterUserValidationError",
            firstNameError: invalidFirstName,
            lastNameError: invalidLastName,
            passwordError: shortPassword,
            confirmPasswordError: "Passwords do not match",
          },
        },
      });
    }

    if (password === passwordStr("success")) {
      return HttpResponse.json({
        data: {
          registerUser: {
            __typename: "RegisteredUser",
            user: {
              __typename: "User",
              id: "SOME_RANDOM_USER_ID",
              email: "user_mail@example.com",
              firstName: FIRST_NAME,
              lastName: LAST_NAME,
              image: null,
              isRegistered: true,
            },
          },
        },
      });
    }

    if (password === passwordStr("graphql")) {
      return HttpResponse.json({ errors: [new GraphQLError(gqlMSG)] });
    }

    if (password === passwordStr("network")) return HttpResponse.error();

    if (password === passwordStr("unsupported")) {
      await delay(80);
      return HttpResponse.json({
        data: { registerUser: { __typename: "UnsupportedType" } },
      });
    }

    return HttpResponse.json();
  }
);

class Mock<T extends string | undefined = undefined> {
  input: Input;

  constructor(
    prefix: string,
    readonly message: T
  ) {
    this.input = {
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      password: passwordStr(prefix),
      confirmPassword: passwordStr(prefix),
    };
  }
}

export const validation = new Mock("validation", undefined);
export const unsupported = new Mock("unsupported", MSG);
const success = new Mock("success", undefined);
const auth = new Mock("auth", undefined);
const registered = new Mock("registered", undefined);
const network = new Mock("network", networkMSG);
const gql = new Mock("graphql", gqlMSG);

const text = "Expect an alert toast if the";
export const alerts: Array<[string, Mock<string>]> = [
  [`${text} API responds with a graphql error`, gql],
  [`${text} request failed with a network error`, network],
];

export const errorRedirects = [
  [
    "Expect an unauthorized user to be redirected to the login page",
    { pathname: "/login", query: { status: "unauthorized" } },
    auth,
  ],
  [
    "Expect an already registered user to be redirected to the home(dashboard) page",
    { pathname: "/", query: { status: "registered" } },
    registered,
  ],
] as const;

export const successRedirects = [
  [
    "Expect a newly registered user to be redirected to the home(dashboard) page",
    { query: {}, page: "/" },
    success,
  ],
  [
    "Expect a newly registered user to be redirected to a route based on the 'redirectTo' url query",
    { query: { redirectTo: "/post-tags" }, page: "/post-tags" },
    success,
  ],
  [
    "Expect a newly registered user to be redirected to the home(dashboard) page if the 'redirectTo' route is not supported",
    { query: { redirectTo: "forgot-password" }, page: "/" },
    success,
  ],
] as const;
