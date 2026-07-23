import type { QueryResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { PostFieldResolver } from ".";
import type { TestData } from "@appTypes/tests";

export type GetPost = PostFieldResolver<
  ResolverFunc<QueryResolvers["getPost"]>
>;

export type GetPostData = TestData<{ getPost: Record<string, unknown> }>;
