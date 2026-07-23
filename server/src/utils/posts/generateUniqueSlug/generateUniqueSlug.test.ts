import { describe, expect, test } from "@jest/globals";
import { generateUniqueSlug } from ".";

describe("Posts | Should convert a post title to a lowercased post url slug", () => {
  test.each([
    ["my-blog-post-slug", "my-blog-post-slug"],
    ["my-new-blog-post-slug", "my-new-blog-post-slug"],
    ["a-crazy-blog-post-title-1", "a-crazy-blog-post-title-1"],
    [
      "a-blog-post-for-oranges-peaches-grapes",
      "a-blog-post-for-oranges-peaches-grapes",
    ],
    ["new-shoes-now-cost-12-85-more", "new-shoes-now-cost-12-85-more"],
    ["john-does-blog-post-title", "john-does-blog-post-title"],
    [
      "a-title-with-non-latin-alphabet-characters",
      "a-title-with-non-latin-alphabet-characters",
    ],
    [
      "my-friends-birthday-the-day-john-doe-told-me-i-love-you-part-1",
      "my-friends-birthday-the-day-john-doe-told-me-i-love-you-part-1",
    ],
    [
      "these-guys-are-not-taller-than-james-brothers",
      "these-guys-are-not-taller-than-james-brothers",
    ],
    [
      "it-is-time-for-music-my-friends-will-not-listen-to",
      "it-is-time-for-music-my-friends-will-not-listen-to",
    ],
    [
      "username-james123-said-they-are-going-out-for-lunch",
      "username-james123-said-they-are-going-out-for-lunch",
    ],
    [
      "the-boys-said-they-have-tried-their-best-i-will-keep-praying-for-them",
      "the-boys-said-they-have-tried-their-best-i-will-keep-praying-for-them",
    ],
    [
      "wont-the-government-reduce-oil-prices",
      "wont-the-government-reduce-oil-prices",
    ],
    [
      "let-us-go-fishing-at-dexters-creek-jack-told-jill",
      "let-us-go-fishing-at-dexters-creek-jack-told-jill",
    ],
    [
      "going-very-long-blog-post-title-over-80-characters-length-so-i-am-going-fill-up",
      "going-very-long-blog-post-title-over-80-characters-length-so-i-am-going",
    ],
  ])(
    "Expect {%s} to be converted into a unique slug by appending a random token to it",
    async (slug, expected) => {
      const result = await generateUniqueSlug(slug);
      expect(result).toMatch(new RegExp(`^${expected}-[a-z0-9]{4}$`));
    },
  );
});
