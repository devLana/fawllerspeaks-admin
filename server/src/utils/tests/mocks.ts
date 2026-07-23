import { getPostSlug } from "@utils/posts/getPostSlug";
import type { RemoveNull } from "@appTypes";
import type { TestPostData } from "@appTypes/tests";

interface TestUser {
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly image: string | null;
  readonly email: string;
  readonly password: string;
  readonly registered: boolean;
}

type Params = Partial<Omit<TestPostData, "title" | "slug">> & {
  readonly title: string;
};

// Test Users
export const unRegisteredUser: TestUser = {
  firstName: null,
  lastName: null,
  image: null,
  email: "unregistered_user_test_email@example.com",
  password: "passWord1!",
  registered: false,
};

export const registeredUser: RemoveNull<TestUser> = {
  email: "registered_user_test_mail@mail.com",
  password: "passWord2!",
  firstName: "Jim",
  lastName: "Maxwell",
  image: "registeredUser/image/storage/path",
  registered: true,
};

export const newRegisteredUser: RemoveNull<TestUser> = {
  email: "new_registered_user@gmail.com",
  password: "passWord3!",
  firstName: "Paul",
  lastName: "Doe",
  image: "newRegisteredUser/image/storage/path",
  registered: true,
};

// Test User Sessions
export const unregisteredReset = {
  token: "2NiAlHaa9YGopc5aP6oJ55YE8QKz-j8ii7vEtgPOUC0",
  hash: "410a1830dbe4b21c01ba08b529bb02dc510d19ae7fb754e1b1a2fa2695f26938",
};

export const newRegisteredReset = {
  token: "atE86XPwwDEv_zlDkNsZ-lXUxZiOmiDaAb29Et4qL5A",
  hash: "37713c02acd2b9f033a45d546dbcecc528b1205dc17269bb4ea9526d8a27e428",
};

export const otherNewRegisteredReset = {
  token: "3E53dWglHY0Dvvx5kv1iK-82YZr9RElRNKSDibhda4Q",
  hash: "475ee532719198d31640ef1ed69ce2c2c7987e2074a35d548d6e4e3322b4665c",
};

export const registeredReset = {
  token: "Ndoc736vY53k0QmVxLoIdqsEpOvm3ToqsCdmp7eROu0",
  hash: "07e88a9b265e3a50ed7f52b9b3836c1e1222e21ba59384ea773187c6755eb5d7",
};

export const otherRegisteredReset = {
  token: "FUXaSS1miuQ9Ue93EflTe7fNaYdIDGqGNVtsVVZbvTc",
  hash: "035014177026c4c78653f92729e6f788496629ee748edf6b3ce63e93e036e550",
};

// Test Post Data
export const testPostData = (p: Params): TestPostData => ({
  title: p.title,
  slug: getPostSlug(p.title),
  status: p.status ?? "Draft",
  description: p.description ?? null,
  excerpt: p.excerpt ?? null,
  content: p.content ?? null,
  imageBanner: p.imageBanner ?? null,
  datePublished: p.datePublished ?? null,
  lastModified: p.lastModified ?? null,
  binnedAt: p.binnedAt ?? null,
});
