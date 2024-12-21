import type { Mutation } from "@apiTypes";
import type { RemoveApiStatusMapper as Mapper } from "@types";

export interface EditProfileImage {
  file: File | null;
  error: string;
  blobUrl: string;
}

export type EditProfileData = Mapper<Pick<Mutation, "editProfile">>;
