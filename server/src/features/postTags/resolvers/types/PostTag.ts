import { dateToISOString } from "@utils";
import type { PostTagResolvers } from "@resolverTypes";

export const PostTag: PostTagResolvers = {
  dateCreated: parent => dateToISOString(parent.dateCreated),

  lastModified: parent => {
    return parent.lastModified ? dateToISOString(parent.lastModified) : null;
  },
};
