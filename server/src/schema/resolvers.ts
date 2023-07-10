import { authResolvers } from "@features/auth";
import { settingsResolvers } from "@features/settings";
import { postTagsResolvers } from "@features/postTags";
import { postsResolvers } from "@features/posts";

import {
  NotAllowedError,
  Response,
  ServerError,
  UnknownError,
  RegistrationError,
  AuthenticationError,
  UserSessionError,
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
  | "Response";

type ResolversDict = Pick<Resolvers, ResolverKeys>;
type RootResolvers = ObjectMapper<ResolversDict>;

export const resolvers: RootResolvers = {
  Query: {
    ...authResolvers.Query,
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

  Response: {
    __isTypeOf: parent => parent instanceof Response,
  },
};
