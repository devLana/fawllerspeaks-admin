import { gql, type TypedDocumentNode } from "@apollo/client";
import type { MutationLogoutArgs } from "@apiTypes";
import type { LogoutData } from "types/layouts/logout";

type Logout = TypedDocumentNode<LogoutData, MutationLogoutArgs>;

export const LOGOUT: Logout = gql`
  mutation Logout($sessionId: String!) {
    logout(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        sessionIdError
      }
      ... on BaseResponse {
        __typename
      }
    }
  }
`;
