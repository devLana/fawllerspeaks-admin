import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import type { QueryGetPostsArgs as Args } from "@appTypes/graphql";
import type { PostsPageData } from "@appTypes/posts/getPosts";

type NextPageData = Omit<PostsPageData["pageData"], "previous">;

interface PageData {
  pageData: NextPageData;
}

type CachedPostsNextPageData = Node<{ getPosts: PageData }, Args>;

export const GET_CACHED_POSTS_NEXT_PAGE_DATA: CachedPostsNextPageData = gql`
  query CachedPostsNextPageData(
    $after: ID
    $size: Int = 12
    $sort: SortPostsBy = date_desc
    $status: PostStatus
  ) {
    getPosts(after: $after, size: $size, sort: $sort, status: $status) {
      ... on GetPostsData {
        pageData {
          next
        }
      }
    }
  }
`;
