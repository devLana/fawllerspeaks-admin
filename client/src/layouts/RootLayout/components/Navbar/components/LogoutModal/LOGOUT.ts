import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Mutation, MutationLogoutArgs } from "@apiTypes";

type LogoutData = Pick<Mutation, "logout">;
type Logout = TypedDocumentNode<LogoutData, MutationLogoutArgs>;

export const LOGOUT: Logout = gql`
  mutation Logout($sessionId: String!) {
    logout(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        sessionIdError
        status
      }

      ... on BaseResponse {
        message
        status
      }
    }
  }
`;
