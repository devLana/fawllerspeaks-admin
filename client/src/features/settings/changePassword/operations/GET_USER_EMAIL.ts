import { gql, type TypedDocumentNode } from "@apollo/client";

type UserEmail = TypedDocumentNode<{ email: string }>;

export const GET_USER_EMAIL: UserEmail = gql`
  fragment GetChangePasswordUser on User {
    email
  }
`;
