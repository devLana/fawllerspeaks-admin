import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/postTags/postTag";
import type { PostTagData } from "@appTypes/postTags";
import type { PostTags } from "@appTypes/graphql";

type Tags = Pick<PostTags, "__typename"> & { tags: PostTagData[] };
type CachedPostTagsData = TypedDocumentNode<{ getPostTags: Tags }>;

export const GET_CACHED_POST_TAGS: CachedPostTagsData = gql`
  ${POST_TAG_FIELDS}
  query GetCachedPostTags {
    getPostTags {
      ... on PostTags {
        tags {
          ...PostTagFields
        }
      }
    }
  }
`;
