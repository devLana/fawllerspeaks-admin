import { gql, type TypedDocumentNode as DocNode } from "@apollo/client";

import { USER_FIELDS } from "@fragments/User";
import type { Query, QueryVerifySessionArgs } from "@apiTypes";

type VerifySessionData = Pick<Query, "verifySession">;
type VerifySession = DocNode<VerifySessionData, QueryVerifySessionArgs>;

export const VERIFY_SESSION: VerifySession = gql`
  ${USER_FIELDS}
  query VerifySession($sessionId: String!) {
    verifySession(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        sessionIdError
        status
      }

      ... on BaseResponse {
        message
        status
      }

      ... on VerifiedSession {
        accessToken
        user {
          ...UserFields
        }
        status
      }
    }
  }
`;
