import { commonResolvers } from "./commonResolvers";
import { authResolvers } from "@features/auth/resolvers";
import { settingsResolvers } from "@features/settings/resolvers";
import { postTagsResolvers } from "@features/postTags/resolvers";
import { postsResolvers } from "@features/posts/resolvers";

export const resolvers = {
  Query: {
    ...postTagsResolvers.Query,
    ...postsResolvers.Queries,
  },

  Mutation: {
    ...authResolvers.Mutations,
    ...settingsResolvers.Mutations,
    ...postTagsResolvers.Mutations,
    ...postsResolvers.Mutations,
  },

  ...commonResolvers,
  ...authResolvers.Types,
  ...settingsResolvers.Types,
  ...postTagsResolvers.Types,
  ...postsResolvers.Types,
};
