import type { Mutation } from "@apiTypes";
import type { RemoveApiStatusMapper } from "@types";

export type LoginData = RemoveApiStatusMapper<Pick<Mutation, "login">>;
