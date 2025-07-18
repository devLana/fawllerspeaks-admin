import { gql } from "@apollo/client";
import { POST_TAG_FIELDS } from "./POST_TAG";

export const POST_FIELDS = gql`
  ${POST_TAG_FIELDS}
  fragment PostFields on Post {
    id
    title
    description
    excerpt
    content {
      html
      tableOfContents {
        heading
        level
        href
      }
    }
    author {
      image
      name
    }
    status
    url {
      href
      slug
    }
    imageBanner
    dateCreated
    datePublished
    lastModified
    views
    tags {
      ...PostTagFields
    }
  }
`;
