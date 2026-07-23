import type {
  GetPostsData as BlogPosts,
  GetPostsPageData,
  Status,
} from "@appTypes/resolverTypes";

import type { PostData, PostDataMapper } from "@appTypes/posts";

export class GetPostsData implements PostDataMapper<BlogPosts> {
  readonly status: Status;
  readonly __typename: "GetPostsData";

  constructor(
    readonly posts: PostData[],
    readonly pageData: GetPostsPageData,
  ) {
    this.status = "SUCCESS";
    this.__typename = "GetPostsData";
  }
}
