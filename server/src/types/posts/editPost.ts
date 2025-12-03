import type { MutationResolvers, PostStatus } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { PostFieldResolver } from ".";
import type { TestData } from "types/tests";

export type Edit = PostFieldResolver<
  ResolverFunc<MutationResolvers["editPost"]>
>;

export interface EditPostCTE {
  is_registered: boolean;
  userName: string;
  userImage: string | null;
  status: PostStatus | null;
  image_banner: string | null;
  is_in_bin: boolean;
}

export type EditData = TestData<{ editPost: Record<string, unknown> }>;
