import type { QueryResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { PostFieldResolver } from ".";
import type { TestData } from "types/tests";

export type GetPosts = PostFieldResolver<
  ResolverFunc<QueryResolvers["getPosts"]>
>;

export interface PreviousPost {
  id: number;
  title: string;
  date_created: string;
}

export interface Sort {
  column: "p.date_created" | "p.title";
  order: "ASC" | "DESC";
}

export type GetPostsTestData = TestData<{ getPosts: Record<string, unknown> }>;
