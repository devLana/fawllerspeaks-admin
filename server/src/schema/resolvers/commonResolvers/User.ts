import supabase from "@lib/supabase/supabaseClient";
import dateToISOString from "@utils/dateToISOString";
import type { UserResolvers } from "@resolverTypes";

export const User: UserResolvers = {
  image: parent => {
    const { storageUrl } = supabase();
    return parent.image ? `${storageUrl}${parent.image}` : null;
  },

  dateCreated: parent => dateToISOString(parent.dateCreated),
};
