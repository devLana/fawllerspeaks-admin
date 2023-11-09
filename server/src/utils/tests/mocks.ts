import type { TestUser, TestPosts, RemoveNull } from "@types";

type RemoveNullFromTestUser = RemoveNull<TestUser>;

export const unRegisteredUser: TestUser = {
  firstName: null,
  lastName: null,
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
  registered: true,
  resetToken: ["registered_reset_token_reset_token", "78"],
};

export const newRegisteredUser: RemoveNullFromTestUser = {
  email: "new_registered_user@gmail.com",
  password: "passWord3!",
  firstName: "Paul",
  lastName: "Doe",
  registered: true,
  resetToken: ["new_registered_user_reset_token", "203"],
};

export const postAuthor: Omit<RemoveNullFromTestUser, "resetToken"> = {
  email: "post_author@mail.com",
  password: "passWord4!",
  firstName: "Paul",
  lastName: "Ruddy",
  registered: true,
};

export const unpublishedTestPosts: TestPosts = {
  first: {
    title: "Post One Title",
    description: "Post One Description",
    content: "Post One Content",
    status: "Unpublished",
    slug: "Post One Slug",
    imageBanner: null,
    datePublished: null,
    lastModified: null,
    isInBin: false,
    isDeleted: false,
  },
  second: {
    title: "Post Two Title",
    description: "Post Two Description",
    content: "Post Two Content",
    status: "Unpublished",
    imageBanner: null,
    datePublished: null,
    lastModified: null,
    isInBin: false,
    isDeleted: false,
  },
};

export const draftTestPosts: TestPosts = {
  first: {
    title: "First Draft Post Title",
    description: "First Draft Post Description",
    content: "First Draft Post Content",
    status: "Draft",
    slug: "First Draft post slug",
    imageBanner: null,
    datePublished: null,
    lastModified: null,
    isInBin: false,
    isDeleted: false,
  },
  second: {
    title: "Second Draft Post Title",
    description: null,
    content: null,
    status: "Draft",
    imageBanner: null,
    datePublished: null,
    lastModified: null,
    isInBin: false,
    isDeleted: false,
  },
};

export const publishedTestPosts: TestPosts = {
  first: {
    title: "First Published Post Title",
    description: "First Published Post Description",
    content: "First Published Post Content",
    status: "Published",
    slug: "First Published post slug",
    imageBanner: null,
    datePublished: null,
    lastModified: null,
    isInBin: false,
    isDeleted: false,
  },
  second: {
    title: "Second Published Post Title",
    description: "Second Published Post Description",
    content: "Second Published Post Content",
    status: "Published",
    imageBanner: null,
    datePublished: null,
    lastModified: null,
    isInBin: false,
    isDeleted: false,
  },
};
