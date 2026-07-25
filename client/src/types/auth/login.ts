import type { LoginMutation } from "@appTypes/graphql";
import type { TypeMapper } from "@appTypes";

export type LoginData = TypeMapper<LoginMutation>;
