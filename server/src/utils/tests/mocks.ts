import getPostSlug from "@features/posts/utils/getPostSlug";
import type { TestUser, TestPostData, RemoveNull } from "@types";

type RemoveNullFromTestUser = RemoveNull<TestUser>;
type Params = Omit<Partial<TestPostData>, "slug" | "imageBanner">;

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

const html =
  "<h2>heading 2</h2><p>Test post content</p><h3>heading 3</h3><p>paragraph</p>";

export const testPostData = (params?: Params): TestPostData => {
  let status: Params["status"];
  let postContent: Params["content"];
  let binnedAt: Params["binnedAt"];

  if (params?.content === null) {
    postContent = null;
  } else {
    postContent = params?.content ?? html;
  }

  if (params?.datePublished) {
    status = "Published";
  } else {
    status = params?.status ?? "Draft";
  }

  if (params?.isBinned) {
    binnedAt = new Date().toISOString();
  } else {
    binnedAt = params?.binnedAt ?? null;
  }

  return {
    title: params?.title ?? "Test post default title",
    slug: getPostSlug(params?.title ?? "Test post default title"),
    description: params?.description ?? "Test post description",
    excerpt: params?.excerpt ?? "Test post excerpt",
    content: postContent,
    status,
    imageBanner: "post/image/banner/storage/path",
    datePublished: params?.datePublished ?? null,
    lastModified: params?.lastModified ?? null,
    isBinned: params?.isBinned ?? false,
    binnedAt,
    isDeleted: params?.isDeleted ?? false,
  };
};
