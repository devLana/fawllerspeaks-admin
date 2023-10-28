import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/PostTag";
import type { PostTags, Query } from "@apiTypes";

type ExtractPostTags = Extract<Query["getPostTags"], PostTags>;

interface PostTagsData {
  getPostTags: Omit<ExtractPostTags, "status" | "__typename">;
}

type CachedPostTags = TypedDocumentNode<PostTagsData>;

export const GET_CACHED_POST_TAGS: CachedPostTags = gql`
  ${POST_TAG_FIELDS}
  query GetCachedPostTags {
    getPostTags {
      tags {
        ...PostTagFields
      }
    }
  }
`;
