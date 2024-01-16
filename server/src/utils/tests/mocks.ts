import type {
  TestUser,
  TestPostData,
  RemoveNull,
  CreateTestPostData,
} from "@types";

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

const description = "Test post description";
const content = "Test post content";
const imageBanner = "post/image/banner/storage/path";
const datePublished = new Date().toISOString();

export const testPostData = (params?: CreateTestPostData): TestPostData => ({
  title: params?.title ?? "Test post default title",
  description:
    params?.description === undefined ? description : params.description,
  content: params?.content === undefined ? content : params.content,
  status: params?.status ?? "Published",
  imageBanner:
    params?.imageBanner === undefined ? imageBanner : params.imageBanner,
  datePublished:
    params?.datePublished === undefined ? datePublished : params.datePublished,
  lastModified: params?.lastModified ?? null,
  isInBin: params?.isInBin ?? false,
  isDeleted: params?.isDeleted ?? false,
});
