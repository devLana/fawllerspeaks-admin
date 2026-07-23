import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";
import type {
  MutationResolvers,
  CreatedPostTagsWarning,
  PostTags,
} from "@appTypes/resolverTypes";

export type CreatePostTags = ResolverFunc<MutationResolvers["createPostTags"]>;
export type Tags = TestData<{ createPostTags: Record<string, unknown> }>;
export type Success = TestData<{ createPostTags: PostTags }>;

export type Warning = TestData<{
  createPostTags: CreatedPostTagsWarning;
}>;
