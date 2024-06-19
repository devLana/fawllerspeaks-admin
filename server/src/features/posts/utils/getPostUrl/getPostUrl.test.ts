import { expect, test } from "@jest/globals";

import getPostUrl from ".";
import { urls } from "@utils/ClientUrls";

test.each([
  [
    "MY Blog POST SLuG",
    {
      slug: "my-blog-post-slug",
      href: `${urls.siteUrl}/blog/my-blog-post-slug`,
    },
  ],
  [
    "My-NEW#Blog_POST | SLug",
    {
      slug: "my-new-blog-post-slug",
      href: `${urls.siteUrl}/blog/my-new-blog-post-slug`,
    },
  ],
  [
    "A _ Crazy . .. Blog Post .Title # ## #1",
    {
      slug: "a-crazy-blog-post-title-1",
      href: `${urls.siteUrl}/blog/a-crazy-blog-post-title-1`,
    },
  ],
  [
    "A Blog Post For Oranges, Peaches & Grapes",
    {
      slug: "a-blog-post-for-oranges-peaches-grapes",
      href: `${urls.siteUrl}/blog/a-blog-post-for-oranges-peaches-grapes`,
    },
  ],
  [
    "New Shoes Now cost $12.85 More.",
    {
      slug: "new-shoes-now-cost-12-85-more",
      href: `${urls.siteUrl}/blog/new-shoes-now-cost-12-85-more`,
    },
  ],
  [
    "@john_doe's Blog Post Title!",
    {
      slug: "john-does-blog-post-title",
      href: `${urls.siteUrl}/blog/john-does-blog-post-title`,
    },
  ],
  [
    "A Tïtle With Nón Ãlphabet Charàcters",
    {
      slug: encodeURIComponent("a-tïtle-with-nón-ãlphabet-charàcters"),
      href: `${urls.siteUrl}/blog/${encodeURIComponent(
        "a-tïtle-with-nón-ãlphabet-charàcters"
      )}`,
    },
  ],
  [
    'My Friend\'s Birthday. The Day John Doe Told Me "I Love You" 🥰 - Part 1',
    {
      slug: "my-friends-birthday-the-day-john-doe-told-me-i-love-you-part-1",
      href: `${urls.siteUrl}/blog/my-friends-birthday-the-day-john-doe-told-me-i-love-you-part-1`,
    },
  ],
  [
    "These Guys Aren't Taller Than James's Brothers",
    {
      slug: "these-guys-are-not-taller-than-james-brothers",
      href: `${urls.siteUrl}/blog/these-guys-are-not-taller-than-james-brothers`,
    },
  ],
  [
    "It's Time For Music My Friends Won't Listen To",
    {
      slug: "it-is-time-for-music-my-friends-will-not-listen-to",
      href: `${urls.siteUrl}/blog/it-is-time-for-music-my-friends-will-not-listen-to`,
    },
  ],
  [
    "USERNAME JAMES123 SAID THEY'RE GOING OUT FOR LUNCH",
    {
      slug: "username-james123-said-they-are-going-out-for-lunch",
      href: `${urls.siteUrl}/blog/username-james123-said-they-are-going-out-for-lunch`,
    },
  ],
  [
    "The Boys Said They've Tried Their Best. I'll keep Praying For Them",
    {
      slug: "the-boys-said-they-have-tried-their-best-i-will-keep-praying-for-them",
      href: `${urls.siteUrl}/blog/the-boys-said-they-have-tried-their-best-i-will-keep-praying-for-them`,
    },
  ],
  [
    "Won't The Government Reduce Oil Prices?",
    {
      slug: "won-t-the-government-reduce-oil-prices",
      href: `${urls.siteUrl}/blog/won-t-the-government-reduce-oil-prices`,
    },
  ],
])(
  "Posts | Should return lowercase slug and url string built from the post title",
  (title, expected) => {
    const result = getPostUrl(title);
    expect(result).toStrictEqual(expected);
  }
);
