import { gql } from "@apollo/client";

export const POST_TAG_FIELDS = gql`
  fragment PostTagFields on PostTag {
    id
    name
  }
`;
