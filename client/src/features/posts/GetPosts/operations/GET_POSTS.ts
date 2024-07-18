import { gql, type TypedDocumentNode } from "@apollo/client";
import type { GetPostsData } from "@types";

export const GET_POSTS: TypedDocumentNode<GetPostsData> = gql`
  query GetPosts {
    getPosts {
      ... on BaseResponse {
        __typename
      }
      ... on Posts {
        posts {
          id
          title
          imageBanner
          status
          dateCreated
          url {
            slug
          }
        }
      }
    }
  }
`;
