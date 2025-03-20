import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { mswData } from "@utils/tests/msw";
import { testPostTag } from "@utils/tests/testPostTag";
import type { PostMetadataFields } from "types/posts";
import type { CreatePostFieldErrors } from "types/posts/createPost";

export const next = { name: /^proceed to post content$/i };
export const title = { name: /^post title$/i };
export const image = /^Select A Post Image Banner$/i;
export const img = { name: /^post image banner preview$/i };
export const changeImg = /^Change Image$/i;
export const description = { name: /^post description$/i };
export const excerpt = { name: /^post excerpt$/i };
export const postTags = { name: /^post tags$/i };
export const draftBtn = { name: /^save as draft$/i };
export const alertBtn = { name: /^Hide input validation errors alert$/i };

export const titleMsg = "Post title cannot be more than 255 characters";
export const excerptMsg = "Post excerpt cannot be more than 300 characters";
export const contentMsg = "Provide post content";
export const tagsMsg = "Invalid post tag id provided";
export const imageBannerMsg = "Image banner string cannot be empty";
export const tagsErrMsg = "Only a maximum of 5 post tags can be selected";
export const descriptionMsg = `Post description cannot be more than 255 characters`;
export const postTagsErrorMsg = `You can't add post tags to this post at the moment. Please try again later`;

export const testTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

const postTagIds = [
  "fc2f2351-80c7-4e4c-b462-11b3512f1293",
  "377fba48-d9e3-4b06-aab6-0b29e2c98413",
  "a2ee44f1-323c-41aa-addd-5fca6f3cc309",
  "3240e4d2-f157-4991-90b2-a7795d75b01f",
  "4589dc3b-eb31-4d53-a34f-d75e14288b59",
  "c11cb682-8a2d-46b8-99d5-8ba33c450ed9",
];

const tags = testTags.map((items, index) => {
  return testPostTag(items, postTagIds[index]);
});

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

export const tagName = (index: number) => ({
  name: new RegExp(`^${testTags[index]}$`),
});

export interface Props {
  postData: PostMetadataFields;
  errors: CreatePostFieldErrors;
  shouldShow: boolean;
}

export const props: Props = {
  shouldShow: false,
  errors: {},
  postData: {
    title: "",
    description: "",
    excerpt: "",
    tagIds: [],
    imageBanner: null,
  },
};

export const maxValuesProps: Props = {
  ...props,
  postData: {
    ...props.postData,
    title:
      "255 characters max 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 character",
    description:
      "255 characters max 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 characters 255 character",
    excerpt:
      "300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max",
  },
};

export const errorsProps: Props = {
  ...props,
  errors: {
    titleError: titleMsg,
    descriptionError: descriptionMsg,
    excerptError: excerptMsg,
    contentError: contentMsg,
    imageBannerError: imageBannerMsg,
    tagIdsError: tagsMsg,
  },
};

export const textBoxProps: Props = {
  ...props,
  postData: {
    ...props.postData,
    title: "Post Title",
    description: "Post Description",
    excerpt: "Post Excerpt",
  },
};
