import type {
  GetPostsData as BlogPosts,
  GetPostsDataResolvers as Resolvers,
  GetPostsPageData,
  Status,
} from "@resolverTypes";

import type { PostData, PostDataMapper } from "@types";

export class GetPostsData implements PostDataMapper<BlogPosts> {
  readonly status: Status;

  constructor(readonly posts: PostData[], readonly pageData: GetPostsPageData) {
    this.status = "SUCCESS";
  }
}

export const GetPostsDataResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof GetPostsData,
};
