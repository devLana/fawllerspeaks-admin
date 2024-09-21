import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/POST_TAG";
import type { PostTagData } from "types/postTags";
import type { PostTags } from "@apiTypes";

type Tags = Pick<PostTags, "__typename"> & { tags: PostTagData[] };
type CachedPostTagsData = TypedDocumentNode<{ getPostTags: Tags }>;

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
