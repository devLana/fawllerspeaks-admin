import type { TestUser, TestPost, RemoveNull } from "@types";

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
  image: "/registeredUser/image/storage/path",
  registered: true,
  resetToken: ["registered_reset_token_reset_token", "78"],
};

export const newRegisteredUser: RemoveNullFromTestUser = {
  email: "new_registered_user@gmail.com",
  password: "passWord3!",
  firstName: "Paul",
  lastName: "Doe",
  image: "/newRegisteredUser/image/storage/path",
  registered: true,
  resetToken: ["new_registered_user_reset_token", "203"],
};

export const unpublishedTestPosts: TestPost = {
  title: "Post One Title",
  description: "Post One Description",
  content: "Post One Content",
  status: "Unpublished",
  imageBanner: null,
  datePublished: null,
  lastModified: null,
  isInBin: false,
  isDeleted: false,
};

export const draftTestPosts: TestPost = {
  title: "First Draft Post Title",
  description: "First Draft Post Description",
  content: "First Draft Post Content",
  status: "Draft",
  imageBanner: null,
  datePublished: null,
  lastModified: null,
  isInBin: false,
  isDeleted: false,
};

export const publishedTestPosts: TestPost = {
  title: "First Published Post Title",
  description: "First Published Post Description",
  content: "First Published Post Content",
  status: "Published",
  imageBanner: null,
  datePublished: null,
  lastModified: null,
  isInBin: false,
  isDeleted: false,
};
