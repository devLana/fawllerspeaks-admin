import { gql, type TypedDocumentNode } from "@apollo/client";
import type { LogoutMutation } from "@appTypes/graphql";

export const LOGOUT: TypedDocumentNode<LogoutMutation, object> = gql`
  mutation Logout {
    logout {
      __typename
    }
  }
`;
