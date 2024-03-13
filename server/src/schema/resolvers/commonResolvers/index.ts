import { User } from "./User";
import {
  AuthCookieError,
  AuthenticationError,
  ForbiddenError,
  NotAllowedError,
  RegistrationError,
  Response,
  ServerError,
  UnknownError,
  UserSessionError,
} from "@utils/ObjectTypes";

import type { ObjectMapper } from "@types";
import type { Resolvers } from "@resolverTypes";

type Keys =
  | "User"
  | "AuthCookieError"
  | "AuthenticationError"
  | "ForbiddenError"
  | "NotAllowedError"
  | "RegistrationError"
  | "Response"
  | "ServerError"
  | "UnknownError"
  | "UserSessionError";

type CommonResolvers = ObjectMapper<Pick<Resolvers, Keys>>;

export const commonResolvers: CommonResolvers = {
  User,

  AuthCookieError: { __isTypeOf: parent => parent instanceof AuthCookieError },

  AuthenticationError: {
    __isTypeOf: parent => parent instanceof AuthenticationError,
  },

  ForbiddenError: { __isTypeOf: parent => parent instanceof ForbiddenError },

  NotAllowedError: { __isTypeOf: parent => parent instanceof NotAllowedError },

  RegistrationError: {
    __isTypeOf: parent => parent instanceof RegistrationError,
  },

  Response: { __isTypeOf: parent => parent instanceof Response },

  ServerError: { __isTypeOf: parent => parent instanceof ServerError },

  UnknownError: { __isTypeOf: parent => parent instanceof UnknownError },

  UserSessionError: {
    __isTypeOf: parent => parent instanceof UserSessionError,
  },
};
