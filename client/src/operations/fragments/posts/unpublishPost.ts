import { gql } from "@apollo/client";

export const UNPUBLISH_POST_FIELDS = gql`
  fragment UnpublishPostFields on Post {
    id
    status
    url {
      slug
    }
  }
`;
