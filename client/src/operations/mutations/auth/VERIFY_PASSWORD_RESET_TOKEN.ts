import { gql, type TypedDocumentNode } from "@apollo/client";
import type { MutationVerifyResetTokenArgs as Args } from "@appTypes/graphql";
import type { VerifyResetTokenData } from "@appTypes/auth/resetPassword";

type VerifyResetToken = TypedDocumentNode<VerifyResetTokenData, Args>;

export const VERIFY_PASSWORD_RESET_TOKEN: VerifyResetToken = gql`
  mutation VerifyResetToken($token: String!) {
    verifyResetToken(token: $token) {
      ... on VerifyResetTokenValidationError {
        __typename
      }
      ... on ForbiddenError {
        message
      }
      ... on VerifiedResetToken {
        email
        resetToken
      }
    }
  }
`;
