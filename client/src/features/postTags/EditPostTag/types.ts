import type { Mutation } from "@apiTypes";
import type { PostTagsDataUnionMapper as Mapper } from "@types";

export type EditPostTagData = Mapper<Pick<Mutation, "editPostTag">>;
