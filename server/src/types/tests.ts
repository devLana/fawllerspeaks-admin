import type { DBPostData } from "./posts";

export interface TestData<T> {
  readonly data?: T;
  readonly errors?: object[];
}

export interface DbTestUser {
  readonly userId: number;
  readonly userUUID: string;
  readonly dateCreated: string;
}

export interface PostDBData extends DBPostData {
  readonly slug: string;
}

export type TestPostData = Omit<
  PostDBData,
  "id" | "dateCreated" | "views" | "url" | "author" | "tags"
>;

export type InputErrors<Type extends object> = {
  [Prop in keyof Type as `${string & Prop}Error`]: string | null | undefined;
};
