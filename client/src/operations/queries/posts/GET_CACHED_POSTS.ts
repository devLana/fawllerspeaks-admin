import { gql, type TypedDocumentNode } from "@apollo/client";

import type { PostData } from "@appTypes/posts";
import type {
  QueryGetPostsArgs as Args,
  GetPostsData,
} from "@appTypes/graphql";

type GetPosts = Pick<GetPostsData, "__typename" | "pageData"> & {
  posts: PostData[];
};

type GetCachedPosts = TypedDocumentNode<{ getPosts: GetPosts }, Args>;

export const GET_CACHED_POSTS: GetCachedPosts = gql`
  query GetCachedPosts(
    $after: ID
    $size: Int = 12
    $sort: SortPostsBy = date_desc
    $status: PostStatus
  ) {
    getPosts(after: $after, size: $size, sort: $sort, status: $status) {
      ... on GetPostsData {
        posts {
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
