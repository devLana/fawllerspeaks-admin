import type { MutationResolvers } from "@resolverTypes";
import type { BasePostData, PostFieldResolver } from ".";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type CreatePost = PostFieldResolver<
  ResolverFunc<MutationResolvers["createPost"]>
>;

export type Create = TestData<{ createPost: Record<string, unknown> }>;

export interface InsertedPost extends BasePostData {
  description: string;
  excerpt: string;
  content: string;
  date_published: string;
}
