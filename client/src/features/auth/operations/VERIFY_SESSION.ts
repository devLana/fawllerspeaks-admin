import { gql, type TypedDocumentNode as DocNode } from "@apollo/client";
import type { Query, QueryVerifySessionArgs } from "@apiTypes";

type VerifySessionData = Pick<Query, "verifySession">;
type VerifySession = DocNode<VerifySessionData, QueryVerifySessionArgs>;

export const VERIFY_SESSION: VerifySession = gql`
  query VerifySession($sessionId: String!) {
    verifySession(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        sessionIdError
        status
      }

      ... on NotAllowedError {
        message
        status
      }

      ... on UnknownError {
        message
        status
      }

      ... on UserSessionError {
        message
        status
      }

      ... on VerifiedSession {
        accessToken
        user {
          id
          email
          firstName
          lastName
          image
          isRegistered
          dateCreated
        }
        status
      }
    }
  }
`;
