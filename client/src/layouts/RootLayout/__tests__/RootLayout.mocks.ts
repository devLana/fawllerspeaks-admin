import { GraphQLError } from "graphql";
import { graphql, HttpResponse, type GraphQLHandler } from "msw";

import { LOGOUT } from "@mutations/auth/logout";

const networkMsg = `The server is currently unreachable. Please try again later`;
const gqlMsg = "Mock graphql error response";
export const name = { name: /^logout$/i };
export const cancel = { name: /^cancel$/i };

export const response = graphql.mutation(LOGOUT, () => {
  return HttpResponse.json({ data: { logout: { __typename: "Response" } } });
});

const gql = graphql.mutation(LOGOUT, () => {
  return HttpResponse.json({ errors: [new GraphQLError(gqlMsg)] });
});

const network = graphql.mutation(LOGOUT, () => HttpResponse.error());

const title = `Expect a toast notification to be rendered if the logout request`;
export const alerts: Array<[string, string, GraphQLHandler]> = [
  [`${title} got a Graphql error response`, gqlMsg, gql],
  [`${title} failed with a network error`, networkMsg, network],
];
