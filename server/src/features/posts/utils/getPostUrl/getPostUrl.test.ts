import { expect, test } from "@jest/globals";

import getPostUrl from ".";
import { urls } from "@utils";

test.each([
  [
    "MY Blog POST SLuG",
    {
      slug: "my-blog-post-slug",
      url: `${urls.siteUrl}/blog/my-blog-post-slug`,
    },
  ],
  [
    "My-NEW#Blog_POST | SLug",
    {
      slug: "my-new#blog-post-|-slug",
      url: `${urls.siteUrl}/blog/my-new#blog-post-|-slug`,
    },
  ],
])(
  "Posts | Should return lowercase slug and url string built from the post title",
  (title, expected) => {
    const result = getPostUrl(title);
    expect(result).toStrictEqual(expected);
  }
);
