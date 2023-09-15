import createUser from "./createUser";
import login from "./login";
import logout from "./logout";
import refreshToken from "./refreshToken";
import registerUser from "./registerUser";
import forgotPassword from "./forgotPassword";
import resetPassword from "./resetPassword";
import generatePassword from "./generatePassword";
import verifyResetToken from "./verifyResetToken";
import verifySession from "./verifySession";

import { VerifiedSessionResolvers } from "./verifySession/types";
import { AccessTokenResolvers } from "./refreshToken/types";
import { ResetPasswordValidationErrorResolvers } from "./resetPassword/types";

import {
  LoggedInUserResolvers,
  LoginValidationErrorResolvers,
} from "./login/types";

import {
  RegisteredUserResolvers,
  RegisterUserValidationErrorResolvers,
} from "./registerUser/types";

import {
  VerifiedResetTokenResolvers,
  VerifyResetTokenValidationErrorResolvers,
} from "./verifyResetToken/types";

import {
  EmailValidationErrorResolvers,
  SessionIdValidationErrorResolvers,
} from "./types";

import type { MutationResolvers, Resolvers } from "@resolverTypes";
import type { ResolversMapper, ObjectMapper } from "@types";

type TypeKeys =
  | "LoggedInUser"
  | "RegisteredUser"
  | "VerifiedSession"
  | "AccessToken"
  | "VerifiedResetToken"
  | "EmailValidationError"
  | "LoginValidationError"
  | "ResetPasswordValidationError"
  | "SessionIdValidationError"
  | "RegisterUserValidationError"
  | "VerifyResetTokenValidationError";

type MutationsKeys =
  | "createUser"
  | "forgotPassword"
  | "login"
  | "logout"
  | "refreshToken"
  | "registerUser"
  | "resetPassword"
  | "generatePassword"
  | "verifyResetToken"
  | "verifySession";

type AuthMutations = Pick<MutationResolvers, MutationsKeys>;
type AuthTypes = Pick<Resolvers, TypeKeys>;

interface AuthResolvers {
  Mutations: ResolversMapper<AuthMutations>;
  Types: ObjectMapper<AuthTypes>;
}

export const authResolvers: AuthResolvers = {
  Mutations: {
    createUser,
    login,
    logout,
    refreshToken,
    registerUser,
    forgotPassword,
    resetPassword,
    generatePassword,
    verifyResetToken,
    verifySession,
  },

  Types: {
    LoggedInUser: LoggedInUserResolvers,
    RegisteredUser: RegisteredUserResolvers,
    VerifiedSession: VerifiedSessionResolvers,
    AccessToken: AccessTokenResolvers,
    VerifiedResetToken: VerifiedResetTokenResolvers,
    EmailValidationError: EmailValidationErrorResolvers,
    LoginValidationError: LoginValidationErrorResolvers,
    ResetPasswordValidationError: ResetPasswordValidationErrorResolvers,
    SessionIdValidationError: SessionIdValidationErrorResolvers,
    RegisterUserValidationError: RegisterUserValidationErrorResolvers,
    VerifyResetTokenValidationError: VerifyResetTokenValidationErrorResolvers,
  },
};
