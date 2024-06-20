import getPostUrl from "@features/posts/utils/getPostUrl";
import type { TestUser, TestPostData, RemoveNull } from "@types";

type RemoveNullFromTestUser = RemoveNull<TestUser>;

export const unRegisteredUser: TestUser = {
  firstName: null,
  lastName: null,
  image: null,
  email: "test_email@example.com",
  password: "passWord1!",
  registered: false,
  resetToken: ["reset_token_reset_token_unregistered", "90"],
};

export const registeredUser: RemoveNullFromTestUser = {
  email: "test_mail@mail.com",
  password: "passWord2!",
  firstName: "Jim",
  lastName: "Maxwell",
  image: "registeredUser/image/storage/path",
  registered: true,
  resetToken: ["registered_reset_token_reset_token", "78"],
};

export const newRegisteredUser: RemoveNullFromTestUser = {
  email: "new_registered_user@gmail.com",
  password: "passWord3!",
  firstName: "Paul",
  lastName: "Doe",
  image: "newRegisteredUser/image/storage/path",
  registered: true,
  resetToken: ["new_registered_user_reset_token", "203"],
};

export const testPostData = (params?: Partial<TestPostData>): TestPostData => ({
  title: params?.title ?? "Test post default title",
  slug: getPostUrl(params?.title ?? "Test post default title").slug,
  description: params?.description ?? "Test post description",
  excerpt: params?.excerpt ?? "Test post excerpt",
  content: params?.content ?? "<p>Test post content</p>",
  status: params?.status ?? "Published",
  imageBanner: params?.imageBanner ?? "post/image/banner/storage/path",
  datePublished: params?.datePublished ?? new Date().toISOString(),
  lastModified: params?.lastModified ?? null,
  isInBin: params?.isInBin ?? false,
  isDeleted: params?.isDeleted ?? false,
});
