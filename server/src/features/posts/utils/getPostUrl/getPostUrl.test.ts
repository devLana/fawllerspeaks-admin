import { expect, test } from "@jest/globals";

import getPostUrl from ".";
import { urls } from "@utils";

test.each([
  ["return lowercase url string", "MY Blog POST SLuG", "my-blog-post-slug"],
  [
    "remove symbols & whitespace and return lowercase url string",
    "My-NEW#Blog_POST | SLug",
    "my-new-blog-post-slug",
  ],
])("Posts | Should %s", (_, slug, expected) => {
  const result = getPostUrl(slug);

  expect(result).toBe(`${urls.siteUrl}/blog/${expected}`);
});
