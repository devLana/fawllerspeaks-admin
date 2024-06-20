import supabase from "@lib/supabase/supabaseClient";
import dateToISOString from "@utils/dateToISOString";
import type { PostResolvers as Resolvers } from "@resolverTypes";
import { getPostContentResponse } from "@features/posts/utils/getPostContentResponse";

export const PostResolvers: Resolvers = {
  content: parent => {
    if (!parent.content) return null;
    return getPostContentResponse(parent.content as unknown as string);
  },

  dateCreated: parent => dateToISOString(parent.dateCreated),

  datePublished: parent => {
    return parent.datePublished ? dateToISOString(parent.datePublished) : null;
  },

  imageBanner: parent => {
    const { storageUrl } = supabase();
    return parent.imageBanner ? `${storageUrl}${parent.imageBanner}` : null;
  },

  lastModified: parent => {
    return parent.lastModified ? dateToISOString(parent.lastModified) : null;
  },
};
