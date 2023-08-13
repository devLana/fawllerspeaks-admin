import changePassword from "./changePassword";
import editProfile from "./editProfile";

import { ChangePasswordValidationErrorResolvers } from "./changePassword/types";
import {
  EditedProfileResolvers,
  EditProfileValidationErrorResolvers,
} from "./editProfile/types";

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
  Mutations: { changePassword, editProfile },

  Types: {
    EditedProfile: EditedProfileResolvers,
    ChangePasswordValidationError: ChangePasswordValidationErrorResolvers,
    EditProfileValidationError: EditProfileValidationErrorResolvers,
  },
};
