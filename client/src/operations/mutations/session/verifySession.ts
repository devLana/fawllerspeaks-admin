import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FIELDS } from "@fragments/session/user";
import type { VerifySessionMutation } from "@appTypes/graphql";

export const VERIFY_SESSION: TypedDocumentNode<VerifySessionMutation> = gql`
  ${USER_FIELDS}
  mutation VerifySession {
    verifySession {
      ... on BaseResponse {
        __typename
      }
      ... on SessionData {
        accessToken
        user {
          ...UserFields
        }
      }
    }
  }
`;
