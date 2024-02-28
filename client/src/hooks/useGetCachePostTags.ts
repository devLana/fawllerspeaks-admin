import { useApolloClient, gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/PostTag";
import type { PostTags } from "@apiTypes";
import type { PostTagData } from "@types";

type Tags = Pick<PostTags, "__typename"> & { tags: PostTagData[] };
type CachePostTagsData = TypedDocumentNode<{ getPostTags: Tags }>;

const GET_CACHE_POST_TAGS: CachePostTagsData = gql`
  ${POST_TAG_FIELDS}
  query GetCachePostTags {
    getPostTags {
      tags {
        ...PostTagFields
      }
    }
  }
`;

export const useGetCachePostTags = () => {
  const client = useApolloClient();
  const cachePostTags = client.readQuery({ query: GET_CACHE_POST_TAGS });

  return cachePostTags?.getPostTags.tags;
};
