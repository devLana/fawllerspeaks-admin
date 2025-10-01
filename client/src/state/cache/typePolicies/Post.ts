import type { Post as PostData } from "@apiTypes";
import { type TypePolicy } from "@apollo/client";

export const Post: TypePolicy = {
  keyFields: post => `Post:${(post as PostData).url.slug}`,
};
