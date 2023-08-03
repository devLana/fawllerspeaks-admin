import { gql, type TypedDocumentNode as DocNode } from "@apollo/client";
import type { Mutation, MutationRefreshTokenArgs } from "@apiTypes";

type RefreshTokenData = Pick<Mutation, "refreshToken">;
type RefreshToken = DocNode<RefreshTokenData, MutationRefreshTokenArgs>;

export const REFRESH_TOKEN: RefreshToken = gql`
  mutation RefreshToken($sessionId: String!) {
    refreshToken(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        sessionIdError
        status
      }

      ... on BaseResponse {
        message
        status
      }

      ... on AccessToken {
        accessToken
        status
      }
    }
  }
`;
