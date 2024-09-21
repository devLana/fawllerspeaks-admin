import { gql, type TypedDocumentNode } from "@apollo/client";

import type { QueryGetPostsArgs } from "@apiTypes";
import type { GetPostsPageData } from "types/posts/getPosts";

type GetPostsData = TypedDocumentNode<GetPostsPageData, QueryGetPostsArgs>;

export const GET_POSTS: GetPostsData = gql`
  fragment PostsPageData on Post {
    id
    title
    imageBanner
    status
    dateCreated
    url {
      slug
    }
  }

  query GetPosts($page: GetPostsPageInput, $filters: GetPostsFiltersInput) {
    getPosts(page: $page, filters: $filters) {
      ... on BaseResponse {
        __typename
      }
      ... on ForbiddenError {
        message
      }
      ... on GetPostsValidationError {
        cursorError
      }
      ... on GetPostsData {
        posts {
          ...PostsPageData
        }
        pageData {
          after
          before
        }
      }
    }
  }
`;
