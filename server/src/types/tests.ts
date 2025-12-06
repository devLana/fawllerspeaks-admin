import type { PostDBData } from "./posts";

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
}

export interface DbTestUser {
  readonly userId: number;
  readonly userUUID: string;
  readonly dateCreated: string;
}

export interface TestPostAuthor {
  readonly userId: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly image: string | null;
}

export type TestPostData = Omit<
  PostDBData,
  "id" | "dateCreated" | "views" | "url" | "author" | "tags"
> & { isDeleted: boolean };

export type InputErrors<Type extends object> = {
  [Prop in keyof Type as `${string & Prop}Error`]: string | null | undefined;
};
