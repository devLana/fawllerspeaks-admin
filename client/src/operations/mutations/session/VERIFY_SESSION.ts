import { gql, type TypedDocumentNode as DocNode } from "@apollo/client";

import { USER_FIELDS } from "@fragments/USER";
import type { MutationVerifySessionArgs } from "@apiTypes";
import type { VerifySessionData } from "types/session/verifySession";

type VerifySession = DocNode<VerifySessionData, MutationVerifySessionArgs>;

export const VERIFY_SESSION: VerifySession = gql`
  ${USER_FIELDS}
  mutation VerifySession($sessionId: String!) {
    verifySession(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        __typename
      }
      ... on BaseResponse {
        __typename
      }
      ... on UnknownError {
        message
      }
      ... on VerifiedSession {
        accessToken
        user {
          ...UserFields
        }
      }
    }
  }
`;
