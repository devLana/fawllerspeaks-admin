import { gql } from "@apollo/client";

export const POST_STATUS = gql`
  fragment UpdatePost on Post {
    status
  }
`;
