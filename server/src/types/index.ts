import type { Request, Response } from "express";
import type { Pool } from "pg";
import type { BaseContext } from "@apollo/server";

import type { Post, PostStatus } from "@resolverTypes";

export interface IClientUrls {
  readonly login: string;
  readonly forgotPassword: string;
  readonly resetPassword: string;
  readonly siteUrl: string;
}

export type ResolverFunc<T> = NonNullable<Exclude<T, Record<string, unknown>>>;

export type ResolversMapper<T extends object> = {
  readonly [Prop in keyof T]-?: ResolverFunc<T[Prop]>;
};

export type ObjectMapper<T extends object> = {
  readonly [Prop in keyof T]-?: T[Prop];
};

export interface TestData<T> {
  readonly data?: T;
  readonly errors?: object[];
}

export interface TestUser {
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly image: string | null;
  readonly email: string;
  readonly password: string;
  readonly registered: boolean;
  readonly resetToken: [string, string];
}

export interface DbTestUser {
  readonly userId: string;
  readonly dateCreated: string;
}

export interface PostDBData {
  readonly id: string;
  readonly postId: string;
  readonly dateCreated: string;
  readonly datePublished: string | null;
  readonly lastModified: string | null;
  readonly views: number;
  readonly isInBin: boolean;
  readonly isDeleted: boolean;
}

export interface GetPostDBData extends PostDBData {
  readonly title: string;
  readonly slug: string;
  readonly description: string | null;
  readonly excerpt: string | null;
  readonly content: string | null;
  readonly status: PostStatus;
  readonly imageBanner: string | null;
}

type TestPostKeys = "id" | "postId" | "dateCreated" | "views";
export type TestPostData = Omit<GetPostDBData, TestPostKeys>;

export interface TestPostAuthor {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly image: string | null;
}

export interface Cookies {
  [index: string]: string | undefined;
  auth?: string;
  token?: string;
  sig?: string;
}

export type ValidationErrorObject<Type extends object> = {
  [Prop in keyof Type as `${string & Prop}Error`]?: string;
};

export type RemoveNull<T extends object> = {
  [Prop in keyof T]: NonNullable<T[Prop]>;
};

export type InputErrors<Type extends object> = {
  [Prop in keyof Type as `${string & Prop}Error`]: string | null | undefined;
};

interface UploadedFile {
  filepath: string;
  mimetype: string;
}

export type ImageCategory = "avatar" | "postBanner" | "postContentImage";
type ImageUploadCategory = Exclude<ImageCategory, "postContentImage">;

export interface ImageUploadRequest extends Request {
  upload?: { file: UploadedFile; imageCategory: ImageUploadCategory };
}

export interface PostContentImageRequest extends Request {
  upload?: { file: UploadedFile };
}

export interface GQLRequest extends Request {
  cookies: Cookies;
}

export interface APIContext extends BaseContext {
  req: GQLRequest;
  res: Response;
  db: Pool;
  user: string | null;
}

export interface PostData extends Omit<Post, "content"> {
  readonly content?: string | null;
}

export type PostDataMapper<T extends object> = T extends { post: Post }
  ? Omit<T, "post"> & { post: PostData }
  : T extends { posts: Post[] }
  ? Omit<T, "posts"> & { posts: PostData[] }
  : T;
