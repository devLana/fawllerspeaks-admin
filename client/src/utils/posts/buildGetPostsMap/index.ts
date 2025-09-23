import type { ApolloCache as Cache } from "@apollo/client";
import type { GetPostsFieldsMapData as MapData } from "types/posts/getPosts";
import type { QueryGetPostsArgs } from "@apiTypes";

type RootQuery = [string, object][];

const buildGetPostsMap = (cache: Cache<unknown>): Map<string, MapData> => {
  const store = cache.extract() as Record<string, object>;
  const getPostsMap = new Map<string, MapData>();
  const ROOT_QUERY = Object.entries(store.ROOT_QUERY || {}) as RootQuery;

  for (const [field, _fieldData] of ROOT_QUERY) {
    const fieldMatch = field.match(/^getPosts\((.*?)\)$/);

    if (!fieldMatch) continue;

    const [, key] = fieldMatch;
    const fieldData = _fieldData as MapData["fieldData"];

    try {
      const args = JSON.parse(key) as QueryGetPostsArgs;
      getPostsMap.set(key, { fieldData, args });
    } catch {
      continue;
    }
  }

  return getPostsMap;
};

export default buildGetPostsMap;
