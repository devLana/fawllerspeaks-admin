import evictSubsequentGetPostsFieldsOnView from "./evictSubsequentGetPostsFieldsOnView";
import type { EvictGetPostsFieldsOptions } from "types/posts";

const evictGetPostsFieldsOnView = ({
  cache,
  getPostsMap,
  args,
  fieldData,
  slug,
  newStatus,
  oldStatus,
}: EvictGetPostsFieldsOptions) => {
  if (args.status === newStatus) {
    cache.evict({ fieldName: "getPosts", args, broadcast: false });
  } else if (args.status === oldStatus) {
    evictSubsequentGetPostsFieldsOnView({
      cache,
      getPostsMap,
      args,
      fieldData,
      slug,
    });
  }
};

export default evictGetPostsFieldsOnView;
