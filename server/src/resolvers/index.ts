import { authResolvers } from "./features/auth";
import { postsResolvers } from "./features/posts";
import { postTagsResolvers } from "./features/postTags";
import { settingsResolvers } from "./features/settings";
import { AuthTypes } from "./typeResolvers/auth";
import { PostsTypes } from "./typeResolvers/posts";
import { PostTagsTypes } from "./typeResolvers/postTags";

export const resolvers = {
  Query: {
    ...postsResolvers.Queries,
    ...postTagsResolvers.Query,
  },

  Mutation: {
    ...authResolvers,
    ...postsResolvers.Mutations,
    ...postTagsResolvers.Mutations,
    ...settingsResolvers,
  },

  ...AuthTypes,
  ...PostsTypes,
  ...PostTagsTypes,
};
