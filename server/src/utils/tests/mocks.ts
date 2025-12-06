import getPostSlug from "@utils/posts/getPostSlug";
import type { RemoveNull } from "@types";
import type { TestUser, TestPostData } from "types/tests";

type RemoveNullFromTestUser = RemoveNull<TestUser>;
type Params = Omit<Partial<TestPostData>, "slug" | "imageBanner">;

export const unRegisteredUser: TestUser = {
  firstName: null,
  lastName: null,
  image: null,
  email: "test_email@example.com",
  password: "passWord1!",
  registered: false,
};

export const registeredUser: RemoveNullFromTestUser = {
  email: "test_mail@mail.com",
  password: "passWord2!",
  firstName: "Jim",
  lastName: "Maxwell",
  image: "registeredUser/image/storage/path",
  registered: true,
};

export const newRegisteredUser: RemoveNullFromTestUser = {
  email: "new_registered_user@gmail.com",
  password: "passWord3!",
  firstName: "Paul",
  lastName: "Doe",
  image: "newRegisteredUser/image/storage/path",
  registered: true,
};

export const unregisteredReset = {
  token: "geBEEmMq148kqdeeWQmynK1kvOBwPg8gGOcFl2Z8XNk",
  hash: "55f482c3aa0fbbac566b5f0a5ac63011d362429987efa189587bbe0430fb62e7",
};

export const newRegisteredReset = {
  token: "DvL2LU8sUQg0OeULKTAs8nJPT_x9NaHIETw12vNrul0",
  hash: "60238d3e2816bf810fa9ce032bf085ba42985e34f6a3b2fb3300a7e1e89c0b0b",
};

export const otherNewRegisteredReset = {
  token: "7c0UauaXpmtBCJUmco3AkcQAgu9-M0xbXxwgsT6bHWo",
  hash: "c07b542d69f34f0b5e6e1fbea5362fc660f8711e4491be686edd11f315381b25",
};

export const registeredReset = {
  token: "hDWlbd_pY3iRI7BKFANn4ok4ZCXfZRvW67br9Usvf8k",
  hash: "76a9306fcc07c34833cab818b5753e82fdab171dadeab4eae205f44e0b43360c",
};

export const otherRegisteredReset = {
  token: "YQkJXWWCrTdkufvT-RL8SdpnzhRypEVtjgNhm4AkauQ",
  hash: "64584b96833487c303f2ababfacd38c4188d805749941841a96e39fdbb2d350d",
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
