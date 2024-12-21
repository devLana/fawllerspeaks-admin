import type { Mutation } from "@apiTypes";
import type { RemoveApiStatusMapper as Mapper } from "@types";

export type RefreshTokenData = Mapper<Pick<Mutation, "refreshToken">>;
