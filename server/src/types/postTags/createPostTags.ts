import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";
import type {
  MutationResolvers,
  CreatedPostTagsWarning,
  PostTags,
} from "@resolverTypes";

export type CreatePostTags = ResolverFunc<MutationResolvers["createPostTags"]>;
export type Tags = TestData<{ createPostTags: Record<string, unknown> }>;
export type Success = TestData<{ createPostTags: PostTags }>;

export type Warning = TestData<{
  createPostTags: CreatedPostTagsWarning;
}>;
