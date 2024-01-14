import supabase from "@lib/supabase/supabaseClient";
import type { AuthorResolvers as Resolvers } from "@resolverTypes";

export const AuthorResolvers: Resolvers = {
  image: parent => {
    const { storageUrl } = supabase();
    return parent.image ? `${storageUrl}${parent.image}` : null;
  },
};
