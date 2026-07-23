import { storageUrl } from "@services/supabase";
import type { PostAuthorResolvers } from "@appTypes/resolverTypes";

export const PostAuthor: PostAuthorResolvers = {
  image: parent => {
    return parent.image ? `${storageUrl}${parent.image}` : null;
  },
};
