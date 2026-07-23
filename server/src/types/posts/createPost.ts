import type { MutationResolvers, SinglePost } from "@appTypes/resolverTypes";
import type { BasePostData, PostFieldResolver } from ".";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type CreatePost = PostFieldResolver<
  ResolverFunc<MutationResolvers["createPost"]>
>;

export type Create = TestData<{ createPost: Record<string, unknown> }>;
export type CreateData = TestData<{ createPost: SinglePost }>;

export interface InsertedPost extends BasePostData {
  description: string;
  excerpt: string;
  content: string;
  date_published: string;
}
