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

import { VerifiedSessionResolvers } from "./verifySession/types/VerifiedSession";
import { AccessTokenResolvers } from "./refreshToken/types/AccessToken";
import { ResetPasswordValidationErrorResolvers } from "./resetPassword/types/ResetPasswordValidationError";

import { LoggedInUserResolvers } from "./login/types/LoggedInUser";
import { LoginValidationErrorResolvers } from "./login/types/LoginValidationError";

import { RegisterUserValidationErrorResolvers } from "./registerUser/types/RegisterUserValidationError";
import { RegisteredUserResolvers } from "./registerUser/types/RegisteredUser";

import { VerifiedResetTokenResolvers } from "./verifyResetToken/types/VerifiedResetToken";
import { VerifyResetTokenValidationErrorResolvers } from "./verifyResetToken/types/VerifyResetTokenValidationError";

import { EmailValidationErrorResolvers } from "./types/EmailValidationError";
import { SessionIdValidationErrorResolvers } from "./types/SessionIdValidationError";

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

interface AuthResolvers {
  Mutations: ResolversMapper<Pick<MutationResolvers, MutationsKeys>>;
  Types: ObjectMapper<Pick<Resolvers, TypeKeys>>;
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
