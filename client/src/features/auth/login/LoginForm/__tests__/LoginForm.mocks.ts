import { GraphQLError } from "graphql";
import { graphql, delay, HttpResponse } from "msw";
import { LOGIN } from "@mutations/auth/login";

interface Redirects {
  query: { redirectTo: string } | Record<string, never>;
  page: string;
}

export const loginBtn = { name: /^login$/i };
export const email = { name: /^e-?mail$/i };
const emailStr = (label: string) => `${label}_test@mail.com`;
const msg1 = "You can't login at this time. Please try again later";
const msg2 = "Invalid e-mail or password";
const msg3 = "Server responded with a graphql error";
const msg4 = "The server is currently unreachable. Please try again later";

const response = (isRegistered: boolean) => {
  return HttpResponse.json({
    data: {
      login: {
        __typename: "SessionData",
        accessToken: "accessToken",
        user: {
          __typename: "User",
          id: "user_id",
          email: "mail@example.com",
          firstName: "first name",
          lastName: "last Name",
          image: null,
          isRegistered,
        },
      },
    },
  });
};

export const loginHandler = graphql.mutation(LOGIN, async ({ variables }) => {
  if (variables.email === emailStr("validation")) {
    return HttpResponse.json({
      data: {
        login: {
          __typename: "LoginValidationError",
          emailError: "Invalid e-mail address",
          passwordError: "Enter Password",
        },
      },
    });
  }

  if (variables.email === emailStr("forbid")) {
    return HttpResponse.json({
      data: { login: { __typename: "ForbiddenError", message: msg2 } },
    });
  }

  if (variables.email === emailStr("registered")) return response(true);
  if (variables.email === emailStr("unregistered")) return response(false);
  if (variables.email === emailStr("network")) return HttpResponse.error();

  if (variables.email === emailStr("graphql")) {
    return HttpResponse.json({ errors: [new GraphQLError(msg3)] });
  }

  if (variables.email === emailStr("unsupported")) {
    await delay(80);
    return HttpResponse.json({
      data: { login: { __typename: "UnsupportedType" } },
    });
  }

  return HttpResponse.json();
});

class Mock<T extends string | undefined = undefined> {
  email: string;

  constructor(
    email: string,
    readonly msg: T
  ) {
    this.email = emailStr(email);
  }
}

export const validation = {
  email: emailStr("validation"),
  emailError: "Invalid e-mail address",
  passwordError: "Enter Password",
};

export const unsupported = new Mock("unsupported", msg1);
export const unregistered = new Mock("unregistered", undefined);
const registered = new Mock("registered", undefined);
const forbid = new Mock("forbid", msg2);
const network = new Mock("network", msg4);
const gql = new Mock("graphql", msg3);

const text = "Expect an alert toast if";
export const errorTable: Array<[string, Mock<string>]> = [
  [`${text} there was an error verifying login credentials`, forbid],
  [`${text} the request failed with a network error`, network],
  [`${text} the API throws a graphql error`, gql],
];

export const successTable: Array<[string, Redirects, Mock]> = [
  [
    "Expect a registered user to be redirected to the dashboard/home page",
    { page: "/", query: {} },
    registered,
  ],
  [
    "Expect a registered user to be redirected to the route in the 'redirectTo' query params",
    { query: { redirectTo: "/posts" }, page: "/posts" },
    registered,
  ],
  [
    "Expect a registered user to be redirected to the dashboard page if the 'redirectTo' query params is not a supported route",
    { query: { redirectTo: "/login" }, page: "/" },
    registered,
  ],
];
