import { gql, type TypedDocumentNode } from "@apollo/client";

import type { QueryGetPostsArgs } from "@appTypes/graphql";
import type { GetPostsPageData } from "@appTypes/posts/getPosts";

type GetPostsData = TypedDocumentNode<GetPostsPageData, QueryGetPostsArgs>;

export const GET_POSTS: GetPostsData = gql`
  query GetPosts(
    $after: ID
    $size: Int = 12
    $sort: SortPostsBy = date_desc
    $status: PostStatus
  ) {
    getPosts(after: $after, size: $size, sort: $sort, status: $status) {
      ... on BaseResponse {
        __typename
      }
      ... on ForbiddenError {
        message
      }
      ... on GetPostsValidationError {
        afterError
        sizeError
      }
      ... on GetPostsData {
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
        pageData {
          previous
          next
        }
      }
    }
  }
`;
