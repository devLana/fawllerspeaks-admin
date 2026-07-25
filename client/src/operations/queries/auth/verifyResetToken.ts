import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  VerifyResetTokenQuery,
  VerifyResetTokenQueryVariables as Vars,
} from "@appTypes/graphql";
import type { TypeMapper } from "@appTypes";

type VerifyResetData = TypeMapper<VerifyResetTokenQuery>;
type VerifyResetToken = TypedDocumentNode<VerifyResetData, Vars>;

export const VERIFY_RESET_TOKEN: VerifyResetToken = gql`
  query VerifyResetToken($token: String!) {
    verifyResetToken(token: $token) {
      ... on VerifyResetTokenValidationError {
        __typename
      }
      ... on ForbiddenError {
        __typename
      }
      ... on VerifiedResetToken {
        email
        resetToken
      }
    }
  }
`;
