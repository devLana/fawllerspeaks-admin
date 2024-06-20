import supabase from "@lib/supabase/supabaseClient";
import type { PostAuthorResolvers as Resolvers } from "@resolverTypes";

export const PostAuthorResolvers: Resolvers = {
  image: parent => {
    const { storageUrl } = supabase();
    return parent.image ? `${storageUrl}${parent.image}` : null;
  },
};
