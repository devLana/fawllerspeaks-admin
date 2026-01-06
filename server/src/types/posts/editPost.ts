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
  id: number | null;
  status: PostStatus;
  image_banner: string | null;
  binned_at: string | null;
}

export type SqlValues = (string | number | null)[];

export type EditData = TestData<{ editPost: Record<string, unknown> }>;
