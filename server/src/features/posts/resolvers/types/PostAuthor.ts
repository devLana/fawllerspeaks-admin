import supabase from "@lib/supabase/supabaseClient";
import type { PostAuthorResolvers as Resolvers } from "@resolverTypes";

export const PostAuthorResolvers: Resolvers = {
  image: parent => {
    const [, , image] = (parent as unknown as string).split(" ");
    const { storageUrl } = supabase();
    return image ? `${storageUrl}${image}` : null;
  },

  name: parent => {
    const [firstName, lastName] = (parent as unknown as string).split(" ");
    return `${firstName} ${lastName}`;
  },
};
