import changePassword from "./changePassword";
import editProfile from "./editProfile";

import { EditedProfileResolver } from "./editProfile/EditedProfile";
import { ChangePasswordValidationErrorResolver } from "./changePassword/ChangePasswordValidationError";
import { EditProfileValidationErrorResolver } from "./editProfile/EditProfileValidationError";

import type { MutationResolvers, Resolvers } from "@resolverTypes";
import type { ResolversMapper, ObjectMapper } from "@types";

type TypeKeys =
  | "EditedProfile"
  | "ChangePasswordValidationError"
  | "EditProfileValidationError";

type MutationsKeys = "changePassword" | "editProfile";
type SettingsMutations = Pick<MutationResolvers, MutationsKeys>;
type SettingsTypes = Pick<Resolvers, TypeKeys>;

interface SettingsResolvers {
  Mutations: ResolversMapper<SettingsMutations>;
  Types: ObjectMapper<SettingsTypes>;
}

export const settingsResolvers: SettingsResolvers = {
  Mutations: {
    changePassword,
    editProfile,
  },

  Types: {
    EditedProfile: EditedProfileResolver,
    ChangePasswordValidationError: ChangePasswordValidationErrorResolver,
    EditProfileValidationError: EditProfileValidationErrorResolver,
  },
};
