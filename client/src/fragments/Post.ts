import { gql } from "@apollo/client";
import { POST_TAG_FIELDS } from "./PostTag";

export const POST_FIELDS = gql`
  ${POST_TAG_FIELDS}
  fragment PostFields on Post {
    id
    title
    description
    content
    author {
      name
      image
    }
    status
    slug
    url
    imageBanner
    dateCreated
    datePublished
    lastModified
    views
    isInBin
    isDeleted
    tags {
      ...PostTagFields
    }
  }
`;
