import { storageUrl } from "@services/supabase";
import { dateToISOString } from "@utils/dateToISOString";
import type { UserResolvers } from "@appTypes/resolverTypes";

export const User: UserResolvers = {
  image: parent => {
    return parent.image ? `${storageUrl}${parent.image}` : null;
  },

  dateCreated: parent => dateToISOString(parent.dateCreated),
};
