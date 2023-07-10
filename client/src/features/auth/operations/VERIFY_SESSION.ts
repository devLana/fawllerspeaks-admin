import { gql, type TypedDocumentNode as DocNode } from "@apollo/client";
import type { Query, QueryVerifySessionArgs } from "@apiTypes";

type VerifySessionData = Pick<Query, "verifySession">;
type VerifySession = DocNode<VerifySessionData, QueryVerifySessionArgs>;

export const VERIFY_SESSION: VerifySession = gql`
  query VerifySession($sessionId: String!) {
    verifySession(sessionId: $sessionId) {
      ... on UserData {
        user {
          email
          id
          firstName
          lastName
          image
          isRegistered
          dateCreated
          accessToken
          sessionId
        }
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

      ... on SessionIdValidationError {
        sessionIdError
        status
      }
    }
  }
`;
