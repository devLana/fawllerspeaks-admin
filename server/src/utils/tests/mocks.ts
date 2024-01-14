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

const createData: CreateTestPostData = {
  status: "Published",
  imageBanner: "post/image/banner/storage/path",
  datePublished: new Date().toISOString(),
  lastModified: null,
  isInBin: false,
  isDeleted: false,
};

export const testPostData = (params = createData): TestPostData => ({
  title: "Test Post Title",
  description: "Test Post Description",
  content: "Test Post Content",
  status: params.status,
  imageBanner: params.imageBanner,
  datePublished: params.datePublished,
  lastModified: params.lastModified,
  isInBin: params.isInBin,
  isDeleted: params.isDeleted,
});
