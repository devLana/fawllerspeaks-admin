import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import type { QueryGetPostsArgs as Args } from "@apiTypes";
import type { PostsPageData } from "types/posts/getPosts";

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
      pageData {
        next
      }
    }
  }
`;
