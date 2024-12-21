import { gql, type TypedDocumentNode as DocNode } from "@apollo/client";
import type { MutationRefreshTokenArgs } from "@apiTypes";
import type { RefreshTokenData } from "types/session/refreshToken";

type RefreshToken = DocNode<RefreshTokenData, MutationRefreshTokenArgs>;

export const REFRESH_TOKEN: RefreshToken = gql`
  mutation RefreshToken($sessionId: String!) {
    refreshToken(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        __typename
      }
      ... on BaseResponse {
        __typename
      }
      ... on AccessToken {
        accessToken
      }
    }
  }
`;
