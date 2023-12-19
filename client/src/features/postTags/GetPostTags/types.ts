import type { Query } from "@apiTypes";
import type { PostTagsDataUnionMapper as Mapper } from "@types";

export type GetPostTagsData = Mapper<Pick<Query, "getPostTags">>;
