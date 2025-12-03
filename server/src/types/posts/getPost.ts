import type { QueryResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { PostFieldResolver } from ".";
import type { TestData } from "types/tests";

export type GetPost = PostFieldResolver<
  ResolverFunc<QueryResolvers["getPost"]>
>;

export type GetPostData = TestData<{ getPost: Record<string, unknown> }>;
