import type { Mutation } from "@apiTypes";
import type { RemoveApiStatusMapper as Mapper } from "@types";

export type RegisterUserData = Mapper<Pick<Mutation, "registerUser">>;
