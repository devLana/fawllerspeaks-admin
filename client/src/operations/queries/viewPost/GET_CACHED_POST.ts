import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/POST";
import type { QueryGetPostArgs } from "@apiTypes";
import type { ModifiedPost } from "types/posts";

interface CachedPost {
  getPost: { post: ModifiedPost };
}

type CachedPostTagsData = TypedDocumentNode<CachedPost, QueryGetPostArgs>;

export const GET_CACHED_POST: CachedPostTagsData = gql`
  ${POST_FIELDS}
  query GetCachePost($slug: String!) {
    getPost(slug: $slug) {
      post {
        ...PostFields
      }
    }
  }
`;
