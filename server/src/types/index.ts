import type { Request, Response } from "express";
import type { Pool } from "pg";
import type { BaseContext } from "@apollo/server";

import type { PostStatus } from "@resolverTypes";

export interface IClientUrls {
  readonly login: string;
  readonly forgotPassword: string;
  readonly resetPassword: string;
  readonly siteUrl: string;
}

export type ResolverFunc<T> = NonNullable<Exclude<T, Record<string, unknown>>>;

export type ResolversMapper<T extends Record<string, unknown>> = {
  readonly [Prop in keyof T]-?: ResolverFunc<T[Prop]>;
};

export type ObjectMapper<T extends Record<string, unknown>> = {
  readonly [Prop in keyof T]-?: T[Prop];
};

export interface TestData<T> {
  readonly data?: T;
  readonly errors?: Record<string, unknown>[];
}

export interface TestUser {
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly email: string;
  readonly password: string;
  readonly registered: boolean;
  readonly resetToken: [string, string];
}

export interface DbTestUser {
  // readonly image: string | null;
  readonly userId: string;
  readonly dateCreated: string;
  readonly resetToken: [string, string] | null;
}

export interface DbCreatePost {
  readonly postId: string;
  readonly imageBanner: string | null;
  readonly dateCreated: string;
  readonly datePublished: string | null;
  readonly lastModified: string | null;
  readonly views: number;
  readonly likes: number;
  readonly isInBin: boolean;
  readonly isDeleted: boolean;
}

export interface DbFindPost extends DbCreatePost {
  readonly title: string;
  readonly description: string;
  readonly content: string;
  readonly author: string;
  readonly status: PostStatus;
  readonly slug: string | null;
  readonly tags: string[] | null;
}

interface TestPost {
  readonly title: string;
  readonly description: string | null;
  readonly content: string | null;
  readonly status: PostStatus;
  readonly slug: string | null;
  readonly imageBanner: string | null;
  readonly datePublished: number | null;
  readonly lastModified: number | null;
  readonly isInBin: boolean;
  readonly isDeleted: boolean;
}

export interface TestPosts {
  readonly first: TestPost;
  readonly second: Omit<TestPost, "slug">;
}

export interface PostAuthor {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface Cookies {
  auth?: string;
  token?: string;
  sig?: string;
}

export type ValidationErrorObject<Type extends Record<string, unknown>> = {
  [Prop in keyof Type as `${string & Prop}Error`]?: string;
};

export type RemoveNull<T extends object> = {
  [Prop in keyof T]: NonNullable<T[Prop]>;
};

export type InputErrors<Type extends Record<string, unknown>> = {
  [Prop in keyof Type as `${string & Prop}Error`]: string | null | undefined;
};

interface UploadedFile {
  filepath: string;
  mimetype: string;
}

export interface UploadRequest extends Request {
  upload?: {
    file: UploadedFile;
    imageCategory: "avatar" | "post";
    uploadDir: string;
  };
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
