import type { Mutation } from "@apiTypes";
import type { RemoveApiStatusMapper as Mapper } from "@types";

export type VerifySessionData = Mapper<Pick<Mutation, "verifySession">>;
