import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { mswData } from "@utils/tests/msw";
import { testPostTag } from "@utils/tests/testPostTag";

export const postTag = { name: /^post tags$/i };
export const image = /^Select A Post Image Banner$/i;
export const changeImage = /^change image$/i;
export const imagePreview = { name: /^Post image banner preview$/i };
export const imageBtn = { name: /^remove image$/i };
export const selectedPostTags = { name: /^selected post tags$/i };
export const titleBox = { name: /^post title$/i };
export const descBox = { name: /^post description$/i };
export const extBox = { name: /^post excerpt$/i };
export const contBox = { name: /^editor editing area/i };
export const metadataNext = { name: /^proceed to post content$/i };
export const contentNext = { name: /^preview post$/i };
export const metadata = { name: /^provide post metadata$/i };
export const cont = { name: /^provide post content$/i };
export const prevs = { name: /^preview blog post$/i };
export const previewBtn = { name: /^publish post$/i };
export const prevBack = { name: /^Go back to provide post content section$/i };
export const contBack = { name: /^Go back to provide post metadata section$/i };
export const loadSavedPost = { name: /^Continue with unfinished post$/i };
export const deleteSavedPost = { name: /^Delete unfinished post$/i };

export const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
export const html = "<h2>Heading 2</h2><p>paragraph</p>";
export const storageMsg = `It seems you have an unfinished post. Would you like to continue from where you stopped? Doing so will overwrite your current progress`;

export const storagePost = {
  title: "Post Title",
  description: "Post Description",
  excerpt: "Post Excerpt",
  tagIds: [
    "fc2f2351-80c7-4e4c-b462-11b3512f1293",
    "a2ee44f1-323c-41aa-addd-5fca6f3cc309",
    "4589dc3b-eb31-4d53-a34f-d75e14288b59",
  ],
  content: html,
};

export const postTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

const postTagIds = [
  "fc2f2351-80c7-4e4c-b462-11b3512f1293",
  "377fba48-d9e3-4b06-aab6-0b29e2c98413",
  "a2ee44f1-323c-41aa-addd-5fca6f3cc309",
  "3240e4d2-f157-4991-90b2-a7795d75b01f",
  "4589dc3b-eb31-4d53-a34f-d75e14288b59",
  "c11cb682-8a2d-46b8-99d5-8ba33c450ed9",
];

const tags = postTags.map((items, index) => {
  return testPostTag(items, postTagIds[index]);
});

export const tagName = (index: number) => ({
  name: new RegExp(`^${postTags[index]}$`),
});

export const server = setupServer(
  graphql.query(GET_POST_TAGS, async () => {
    await delay();
    return mswData("getPostTags", "PostTags", { tags });
  })
);
