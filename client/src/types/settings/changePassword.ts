import type { Mutation } from "@apiTypes";
import type { RemoveApiStatusMapper as Mapper } from "@types";

export type ChangePasswordData = Mapper<Pick<Mutation, "changePassword">>;
