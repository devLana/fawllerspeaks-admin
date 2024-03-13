import changePassword from "./changePassword";
import editProfile from "./editProfile";

import { ChangePasswordValidationErrorResolvers } from "./changePassword/types/ChangePasswordValidationError";
import { EditProfileValidationErrorResolvers } from "./editProfile/types/EditProfileValidationError";
import { EditedProfileResolvers } from "./editProfile/types/EditedProfile";

import type { MutationResolvers, Resolvers } from "@resolverTypes";
import type { ResolversMapper, ObjectMapper } from "@types";

type TypeKeys =
  | "EditedProfile"
  | "ChangePasswordValidationError"
  | "EditProfileValidationError";

type MutationsKeys = "changePassword" | "editProfile";

interface SettingsResolvers {
  Mutations: ResolversMapper<Pick<MutationResolvers, MutationsKeys>>;
  Types: ObjectMapper<Pick<Resolvers, TypeKeys>>;
}

export const settingsResolvers: SettingsResolvers = {
  Mutations: { changePassword, editProfile },

  Types: {
    EditedProfile: EditedProfileResolvers,
    ChangePasswordValidationError: ChangePasswordValidationErrorResolvers,
    EditProfileValidationError: EditProfileValidationErrorResolvers,
  },
};
