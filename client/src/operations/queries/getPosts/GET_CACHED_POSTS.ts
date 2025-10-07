import { gql, type TypedDocumentNode } from "@apollo/client";

import type { PostData } from "types/posts";
import type { QueryGetPostsArgs as Args, GetPostsData } from "@apiTypes";

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
      posts {
        url {
          slug
        }
      }
      pageData
    }
  }
`;
