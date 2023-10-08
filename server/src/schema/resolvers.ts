import { authResolvers } from "@features/auth";
import { settingsResolvers } from "@features/settings";
import { postTagsResolvers } from "@features/postTags";
import { postsResolvers } from "@features/posts";

import supabase from "@lib/supabase/supabaseClient";
import {
  NotAllowedError,
  Response,
  ServerError,
  UnknownError,
  RegistrationError,
  AuthenticationError,
  UserSessionError,
  ForbiddenError,
  AuthCookieError,
} from "@utils";

import type { ObjectMapper } from "@types";
import type { Resolvers } from "@resolverTypes";

type ResolverKeys =
  | "Query"
  | "Mutation"
  | "ServerError"
  | "UnknownError"
  | "NotAllowedError"
  | "RegistrationError"
  | "AuthenticationError"
  | "UserSessionError"
  | "ForbiddenError"
  | "AuthCookieError"
  | "Response"
  | "User";

type ResolversDict = Pick<Resolvers, ResolverKeys>;
type RootResolvers = ObjectMapper<ResolversDict>;

export const resolvers: RootResolvers = {
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

  ...authResolvers.Types,
  ...settingsResolvers.Types,
  ...postTagsResolvers.Types,
  ...postsResolvers.Types,

  ServerError: {
    __isTypeOf: parent => parent instanceof ServerError,
  },

  UnknownError: {
    __isTypeOf: parent => parent instanceof UnknownError,
  },

  NotAllowedError: {
    __isTypeOf: parent => parent instanceof NotAllowedError,
  },

  RegistrationError: {
    __isTypeOf: parent => parent instanceof RegistrationError,
  },

  AuthenticationError: {
    __isTypeOf: parent => parent instanceof AuthenticationError,
  },

  UserSessionError: {
    __isTypeOf: parent => parent instanceof UserSessionError,
  },

  ForbiddenError: {
    __isTypeOf: parent => parent instanceof ForbiddenError,
  },

  AuthCookieError: {
    __isTypeOf: parent => parent instanceof AuthCookieError,
  },

  Response: {
    __isTypeOf: parent => parent instanceof Response,
  },

  User: {
    image: parent => {
      const { storageUrl } = supabase();
      return parent.image ? `${storageUrl}${parent.image}` : null;
    },
  },
};
