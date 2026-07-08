import { gql, type TypedDocumentNode } from "@apollo/client";
import type { RefreshTokenMutation } from "@appTypes/graphql";

export const REFRESH_TOKEN: TypedDocumentNode<RefreshTokenMutation> = gql`
  mutation RefreshToken {
    refreshToken {
      ... on BaseResponse {
        __typename
      }
      ... on RefreshData {
        accessToken
      }
    }
  }
`;
