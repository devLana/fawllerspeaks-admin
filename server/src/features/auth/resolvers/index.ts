import verifySession from "./verifySession";
import createUser from "./createUser";
import login from "./login";
import logout from "./logout";
import refreshToken from "./refreshToken";
import registerUser from "./registerUser";
import forgotPassword from "./forgotPassword";
import resetPassword from "./resetPassword";
import generatePassword from "./generatePassword";
import verifyResetToken from "./verifyResetToken";

import { AccessTokenResolver } from "./refreshToken/AccessToken";
import { VerifiedResetTokenResolver } from "./verifyResetToken/VerifiedResetToken";
import { LoginValidationErrorResolver } from "./login/LoginValidationError";
import { ResetPasswordValidationErrorResolver } from "./resetPassword/ResetPasswordValidationError";
import { RegisterUserValidationErrorResolver } from "./registerUser/RegisterUserValidationError";
import { VerifyResetTokenValidationErrorResolver } from "./verifyResetToken/VerifyResetTokenValidationError";

import {
  UserDataResolver,
  EmailValidationErrorResolver,
  SessionIdValidationErrorResolver,
} from "./types";

import type {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "@resolverTypes";
import type { ResolversMapper, ObjectMapper } from "@types";

type TypeKeys =
  | "UserData"
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
  | "verifyResetToken";

type AuthQuery = Pick<QueryResolvers, "verifySession">;
type AuthMutations = Pick<MutationResolvers, MutationsKeys>;
type AuthTypes = Pick<Resolvers, TypeKeys>;

interface AuthResolvers {
  Query: ResolversMapper<AuthQuery>;
  Mutations: ResolversMapper<AuthMutations>;
  Types: ObjectMapper<AuthTypes>;
}

export const authResolvers: AuthResolvers = {
  Query: {
    verifySession,
  },

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
  },

  Types: {
    UserData: UserDataResolver,
    AccessToken: AccessTokenResolver,
    VerifiedResetToken: VerifiedResetTokenResolver,
    EmailValidationError: EmailValidationErrorResolver,
    LoginValidationError: LoginValidationErrorResolver,
    ResetPasswordValidationError: ResetPasswordValidationErrorResolver,
    SessionIdValidationError: SessionIdValidationErrorResolver,
    RegisterUserValidationError: RegisterUserValidationErrorResolver,
    VerifyResetTokenValidationError: VerifyResetTokenValidationErrorResolver,
  },
};
