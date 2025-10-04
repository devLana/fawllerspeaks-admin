import { gql } from "@apollo/client";

export const BIN_POST_FIELDS = gql`
  fragment BinPostFields on Post {
    id
    url {
      slug
    }
    status
    isBinned
    binnedAt
  }
`;
