import type { Query } from "@apiTypes";
import type { PostDataMapper } from ".";

export type ViewPostData = PostDataMapper<Pick<Query, "getPost">>;
