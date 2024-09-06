import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@features/postTags/gqlFragments/PostTag";
import type { PostTagData } from "@features/postTags/types";
import type { PostTags } from "@apiTypes";

type Tags = Pick<PostTags, "__typename"> & { tags: PostTagData[] };
type CachePostTagsData = TypedDocumentNode<{ getPostTags: Tags }>;

export const GET_CACHE_POST_TAGS: CachePostTagsData = gql`
  ${POST_TAG_FIELDS}
  query GetCachePostTags {
    getPostTags {
      tags {
        ...PostTagFields
      }
    }
  }
`;
