import supabase from "@lib/supabase/supabaseClient";
import { dateToISOString } from "@utils";
import type { PostResolvers as Resolvers } from "@resolverTypes";

export const PostResolvers: Resolvers = {
  imageBanner: parent => {
    const { storageUrl } = supabase();
    return parent.imageBanner ? `${storageUrl}${parent.imageBanner}` : null;
  },

  dateCreated: parent => dateToISOString(parent.dateCreated),

  datePublished: parent => {
    return parent.datePublished ? dateToISOString(parent.datePublished) : null;
  },

  lastModified: parent => {
    return parent.lastModified ? dateToISOString(parent.lastModified) : null;
  },
};
