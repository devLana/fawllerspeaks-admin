import { storageUrl } from "@services/supabase";
import dateToISOString from "@utils/dateToISOString";
import { getPostContentResponse } from "@utils/posts/getPostContentResponse";

import type { PostResolvers } from "@resolverTypes";

export const Post: PostResolvers = {
  content: parent => {
    if (!parent.content) return null;
    return getPostContentResponse(parent.content as unknown as string);
  },

  dateCreated: parent => dateToISOString(parent.dateCreated),

  datePublished: parent => {
    return parent.datePublished ? dateToISOString(parent.datePublished) : null;
  },

  imageBanner: parent => {
    return parent.imageBanner ? `${storageUrl}${parent.imageBanner}` : null;
  },

  lastModified: parent => {
    return parent.lastModified ? dateToISOString(parent.lastModified) : null;
  },

  binnedAt: parent => {
    return parent.binnedAt ? dateToISOString(parent.binnedAt) : null;
  },
};
