import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { testPostTag } from "@utils/tests/testPostTag";
import type { GetPostTagsData } from "types/postTags/getPostTags";
import type { PostActionStatus } from "types/posts";
import type * as types from "types/posts/editPost";
import type { PostStatus } from "@apiTypes";

export const testTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

const tagIds = [
  "fc2f2351-80c7-4e4c-b462-11b3512f1293",
  "377fba48-d9e3-4b06-aab6-0b29e2c98413",
  "a2ee44f1-323c-41aa-addd-5fca6f3cc309",
  "3240e4d2-f157-4991-90b2-a7795d75b01f",
  "4589dc3b-eb31-4d53-a34f-d75e14288b59",
  "c11cb682-8a2d-46b8-99d5-8ba33c450ed9",
];

const tags = testTags.map((items, index) => testPostTag(items, tagIds[index]));

export const selectedPostTags = { name: /^selected post tags$/i };
export const check = { name: /^publish post$/i };
export const next = { name: /^proceed to post content$/i };
export const title = { name: /^post title$/i };
export const description = { name: /^post description$/i };
export const excerpt = { name: /^post excerpt$/i };
export const image = /^Select A Post Image Banner$/i;
export const changeImg = /^Change Image$/i;
export const imageBtn = { name: /^remove image$/i };
export const postTags = { name: /^post tags$/i };
export const img = { name: /^post image banner preview$/i };
export const errors = { name: /^input validation errors$/i };
export const alertBtn = { name: /^Hide input validation errors alert$/i };

export const tagName = (index: number) => ({
  name: new RegExp(`^${testTags[index]}$`, "i"),
});

export const postIdMsg = "Post id cannot be empty";
export const titleMsg = "Post title cannot be more than 255 characters";
export const descriptionMsg = `Post description cannot be more than 255 characters`;
export const excerptMsg = "Post excerpt cannot be more than 300 characters";
export const contentMsg = "Provide post content";
export const tagsMsg = "Invalid post tag id provided";
export const imageBannerMsg = "Image banner string cannot be empty";
export const editStatusMsg = "Edit status cannot be empty";
export const tagsErrMsg = "Only a maximum of 5 post tags can be selected";

export const writeTags: Cache.WriteQueryOptions<GetPostTagsData, object> = {
  query: GET_POST_TAGS,
  data: { getPostTags: { __typename: "PostTags", tags } },
};

export const postTagsData: types.PostTagsFetchData = {
  data: { getPostTags: { __typename: "PostTags", tags } },
  error: undefined,
  loading: false,
};

export interface Props {
  postData: Omit<types.EditPostStateData, "id" | "content">;
  errors: types.EditPostFieldErrors;
  editStatus: PostActionStatus;
  postStatus: PostStatus;
}

export const props: Props = {
  editStatus: "idle",
  postStatus: "Draft",
  errors: {},
  postData: {
    title: "",
    description: "",
    excerpt: "",
    tagIds: [],
    imageBanner: { url: null, file: null },
    editStatus: false,
  },
};

export const textBoxUIProps: Props = {
  ...props,
  postData: {
    ...props.postData,
    title: "Post Title",
    description: "Post Description",
    excerpt: "Post Excerpt",
  },
};

export const selectUIProps: Props = {
  ...props,
  postData: {
    ...props.postData,
    tagIds: [
      "377fba48-d9e3-4b06-aab6-0b29e2c98413",
      "4589dc3b-eb31-4d53-a34f-d75e14288b59",
    ],
  },
};

export const imgUIProps: Props = {
  ...props,
  postData: {
    ...props.postData,
    imageBanner: { url: "https://storage.com/image.jpg", file: null },
  },
};

export const checked: Props = {
  ...props,
  postData: { ...props.postData, editStatus: true },
};

interface Name {
  name: RegExp;
}

export const postStatus: [string, Props, { text: string; label: Name }][] = [
  [
    "Expect the right post status information to be rendered for a Draft post",
    props,
    { text: "Post Status: Draft", label: { name: /^Publish Post$/i } },
  ],
  [
    "Expect the right post status information to be rendered for a Published post",
    { ...props, postStatus: "Published" },
    { text: "Post Status: Published", label: { name: /^Unpublish Post$/i } },
  ],
  [
    "Expect the right post status information to be rendered for an Unpublished post",
    { ...props, postStatus: "Unpublished" },
    { text: "Post Status: Unpublished", label: { name: /^Publish Post$/i } },
  ],
];

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
  editStatus: "inputError",
  errors: {
    idError: postIdMsg,
    titleError: titleMsg,
    descriptionError: descriptionMsg,
    excerptError: excerptMsg,
    contentError: contentMsg,
    tagIdsError: tagsMsg,
    imageBannerError: imageBannerMsg,
    editStatusError: editStatusMsg,
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
