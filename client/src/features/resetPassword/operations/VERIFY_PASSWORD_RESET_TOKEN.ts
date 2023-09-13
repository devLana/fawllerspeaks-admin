import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Mutation, MutationVerifyResetTokenArgs as Args } from "@apiTypes";

type VerifyResetTokenData = Pick<Mutation, "verifyResetToken">;
type VerifyResetToken = TypedDocumentNode<VerifyResetTokenData, Args>;

export const VERIFY_PASSWORD_RESET_TOKEN: VerifyResetToken = gql`
  mutation VerifyResetToken($token: String!) {
    verifyResetToken(token: $token) {
      ... on VerifyResetTokenValidationError {
        __typename
      }
      ... on BaseResponse {
        __typename
      }
      ... on VerifiedResetToken {
        email
        resetToken
      }
    }
  }
`;
