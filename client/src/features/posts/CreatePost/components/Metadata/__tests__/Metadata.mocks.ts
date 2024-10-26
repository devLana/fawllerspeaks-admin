import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { mswData } from "@utils/tests/msw";
import { testPostTag } from "@utils/tests/testPostTag";
import type { DraftErrorCb } from "types/posts/createPost";

export const next = { name: /^proceed to post content$/i };
export const title = { name: /^post title$/i };
export const image = /^Select A Post Image Banner$/i;
export const description = { name: /^post description$/i };
export const excerpt = { name: /^post excerpt$/i };
export const postTags = { name: /^post tags$/i };
export const draftBtn = { name: /^save as draft$/i };
export const titleMsg = "Post title can not be more than 255 characters";
export const excerptMsg = "Post excerpt can not be more than 300 characters";
export const contentMsg = "Provide post content";
export const tagsMsg = "Invalid post tag id provided";
export const imageBannerMsg = "Image banner string cannot be empty";

export const descriptionMsg =
  "Post description can not be more than 255 characters";

export const postTagsErrorMsg =
  "You can't add post tags to this post at the moment. Please try again later";

const tags = [
  testPostTag("Tag 1", "1"),
  testPostTag("Tag 2", "2"),
  testPostTag("Tag 3", "3"),
];

export const server = setupServer(
  graphql.query(GET_POST_TAGS, async () => {
    await delay();
    return mswData("getPostTags", "PostTags", { tags });
  })
);

export const getPostTagResolver = () => {
  server.use(
    graphql.query(GET_POST_TAGS, async () => {
      await delay();
      return mswData("getPostTags", "UnsupportedType");
    })
  );
};

export const callback = (errorCb?: DraftErrorCb) => {
  setTimeout(() => {
    errorCb?.({
      titleError: titleMsg,
      descriptionError: descriptionMsg,
      excerptError: excerptMsg,
    });
  }, 50);
};

export interface Props {
  title: string;
  description: string;
  excerpt: string;
  contentError?: string;
  imageBannerError?: string;
  tagIdsError?: string;
}

export const props = { title: "", description: "", excerpt: "" };

export const maxValuesProps: Props = {
  title:
    "255 characters max 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 character",
  description:
    "255 characters max 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 character",
  excerpt:
    "300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max",
};

export const errorsProps: Props = {
  ...props,
  contentError: contentMsg,
  imageBannerError: imageBannerMsg,
  tagIdsError: tagsMsg,
};

export const textBoxProps: Props = {
  title: "Post Title",
  description: "Post Description",
  excerpt: "Post Excerpt",
};
