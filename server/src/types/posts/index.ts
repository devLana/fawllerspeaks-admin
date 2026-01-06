import type {
  Post,
  PostAuthor,
  PostStatus,
  PostTag,
  PostUrl,
  ResolverTypeWrapper,
} from "@resolverTypes";

export interface DBPostData {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly excerpt: string | null;
  readonly content: string | null;
  readonly status: PostStatus;
  readonly imageBanner: string | null;
  readonly dateCreated: string;
  readonly datePublished: string | null;
  readonly lastModified: string | null;
  readonly views: number;
  readonly binnedAt: string | null;
  readonly tags: PostTag[] | null;
}

export interface GetPostDBData extends DBPostData {
  readonly postId: number;
  readonly author: PostAuthor;
  readonly url: PostUrl;
}

export interface PostData extends Omit<Post, "content"> {
  readonly content?: string | null;
}

export type PostDataMapper<T extends object> = T extends { post: Post }
  ? Omit<T, "post"> & { post: PostData }
  : T extends { posts: readonly Post[] }
  ? Omit<T, "posts"> & { posts: PostData[] }
  : T;

type FunctionLike = (...args: never[]) => object;

type PostFieldTypes<T extends FunctionLike> = Exclude<
  ReturnType<T>,
  Promise<object>
>;

type PostFieldMapper<T extends FunctionLike> = PostDataMapper<
  PostFieldTypes<T>
>;

export type PostFieldResolver<T extends FunctionLike> = (
  ...args: Parameters<T>
) => ResolverTypeWrapper<PostFieldMapper<T>>;

export interface UnpublishUndo {
  is_registered: boolean;
  status: PostStatus | null;
  binned_at: string | null;
}

export interface BasePostData {
  id: number;
  post_id: string;
  slug: string;
  title: string;
  status: PostStatus;
  image_banner: string | null;
  date_created: string;
  last_modified: string | null;
  views: number;
  binned_at: string | null;
}

export interface Draft_Edit extends BasePostData {
  description: string | null;
  excerpt: string | null;
  date_published: string | null;
}
