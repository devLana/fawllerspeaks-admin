import type { PostTag } from "@resolverTypes";

const mapPostTags = (tags: string[], map: Map<string, PostTag>) => {
  const mapped = tags.reduce((acc: PostTag[], tagId: string) => {
    const tag = map.get(tagId);

    if (tag) acc.push(tag);

    return acc;
  }, []);

  return mapped.length === 0 ? null : mapped;
};

export default mapPostTags;
