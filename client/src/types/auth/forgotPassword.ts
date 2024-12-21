import type { Mutation } from "@apiTypes";
import type { RemoveApiStatusMapper as Mapper } from "@types";

export type ForgotPasswordData = Mapper<Pick<Mutation, "forgotPassword">>;
