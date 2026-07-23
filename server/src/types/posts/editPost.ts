import type { MutationResolvers, PostStatus } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { PostFieldResolver } from ".";
import type { TestData } from "@appTypes/tests";

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
