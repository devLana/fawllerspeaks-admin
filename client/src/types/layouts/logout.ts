import type { Mutation } from "@apiTypes";
import type { RemoveApiStatusMapper } from "@types";

export type LogoutData = RemoveApiStatusMapper<Pick<Mutation, "logout">>;
