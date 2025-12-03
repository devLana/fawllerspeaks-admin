import type { Request, Response } from "express";
import type { Pool } from "pg";
import type { BaseContext } from "@apollo/server";

export type ResolverFunc<T> = NonNullable<Exclude<T, Record<string, unknown>>>;

export type ObjectMapper<T extends object> = {
  readonly [Prop in keyof T]-?: T[Prop];
};

export interface Cookies {
  [index: string]: string | undefined;
  auth?: string;
  token?: string;
  sig?: string;
}

export type RemoveNull<T extends object> = {
  [Prop in keyof T]: NonNullable<T[Prop]>;
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
