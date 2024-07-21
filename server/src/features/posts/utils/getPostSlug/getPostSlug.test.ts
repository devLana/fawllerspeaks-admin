import { describe, expect, test } from "@jest/globals";
import getPostUrl from ".";

describe("Posts | Should convert a post title to a lowercased post url slug", () => {
  test.each([
    ["MY Blog POST SLuG", "my-blog-post-slug"],
    ["My-NEW#Blog_POST | SLug", "my-new-blog-post-slug"],
    ["A _ Crazy . .. Blog Post .Title # ## #1", "a-crazy-blog-post-title-1"],
    [
      "A Blog Post For Oranges, Peaches & Grapes",
      "a-blog-post-for-oranges-peaches-grapes",
    ],
    ["New Shoes Now cost $12.85 More.", "new-shoes-now-cost-12-85-more"],
    ["@john_doe's Blog Post Title!", "john-does-blog-post-title"],
    [
      "A Tïtle With Nón Ãlphabet Charàcters",
      "a-tïtle-with-nón-ãlphabet-charàcters",
    ],
    [
      'My Friend\'s Birthday. The Day John Doe Told Me "I Love You" 🥰 - Part 1',
      "my-friends-birthday-the-day-john-doe-told-me-i-love-you-part-1",
    ],
    [
      "These Guys Aren't Taller Than James's Brothers",
      "these-guys-are-not-taller-than-james-brothers",
    ],
    [
      "It's Time For Music My Friends Won't Listen To",
      "it-is-time-for-music-my-friends-will-not-listen-to",
    ],
    [
      "USERNAME JAMES123 SAID THEY'RE GOING OUT FOR LUNCH",
      "username-james123-said-they-are-going-out-for-lunch",
    ],
    [
      "The Boys Said They've Tried Their Best. I'll keep Praying For Them",
      "the-boys-said-they-have-tried-their-best-i-will-keep-praying-for-them",
    ],
    [
      "Won't The Government Reduce Oil Prices?",
      "won-t-the-government-reduce-oil-prices",
    ],
    [
      "\"Let's Go Fishing At Dexter's Creek\", Jack Told Jill",
      "let-us-go-fishing-at-dexters-creek-jack-told-jill",
    ],
  ])("Expect {%s} to be converted to {%s}", (title, expected) => {
    const result = getPostUrl(title);
    expect(result).toMatch(expected);
  });
});
