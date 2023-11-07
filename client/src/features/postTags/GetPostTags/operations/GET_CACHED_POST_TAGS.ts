import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/PostTag";
import type { CachePostTags } from "@types";

type CachedPostTagsData = TypedDocumentNode<CachePostTags>;

export const GET_CACHED_POST_TAGS: CachedPostTagsData = gql`
  ${POST_TAG_FIELDS}
  query GetCachedPostTags {
    getPostTags {
      tags {
        ...PostTagFields
      }
    }
  }
`;
