import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { testPostTag } from "@utils/tests/testPostTag";
import type { GetPostTagsData } from "types/postTags/getPostTags";
import type { PostActionStatus } from "types/posts";
import type * as types from "types/posts/editPost";
import type { PostStatus } from "@apiTypes";

export const postStatus = /^post title blog post status$/i;
export const postInfo = { name: /^post information$/i };
export const postTags = { name: /^post tags$/i };
export const postImg = { name: /^post title image banner$/i };
export const postContent = { name: /^post content$/i };
export const html = "<h2>Heading 2</h2><p>paragraph</p>";
export const errors = { name: /^input validation errors$/i };
export const hideErrors = { name: /^hide input validation errors alert$/i };
export const editBtn = { name: /^edit post$/i };
export const dialog = { name: /^edit blog post$/i };
export const edit = { name: /^edit$/i };

const testTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

const tagIds = [
  "fc2f2351-80c7-4e4c-b462-11b3512f1293",
  "377fba48-d9e3-4b06-aab6-0b29e2c98413",
  "a2ee44f1-323c-41aa-addd-5fca6f3cc309",
  "3240e4d2-f157-4991-90b2-a7795d75b01f",
  "4589dc3b-eb31-4d53-a34f-d75e14288b59",
  "c11cb682-8a2d-46b8-99d5-8ba33c450ed9",
];

const tags = testTags.map((items, index) => testPostTag(items, tagIds[index]));

export const writeTags: Cache.WriteQueryOptions<GetPostTagsData, object> = {
  query: GET_POST_TAGS,
  data: { getPostTags: { __typename: "PostTags", tags } },
};

export interface Props {
  editStatus: PostActionStatus;
  errors: types.EditPostFieldErrors;
  isOpen: boolean;
  postData: types.EditPostStateData;
  postStatus: PostStatus;
}

export const props: Props = {
  editStatus: "idle",
  errors: {},
  isOpen: false,
  postStatus: "Draft",
  postData: {
    id: "67f14943-2768-4fd9-ae78-fa089bcfbf9e",
    title: "Post Title",
    description: "Post Description",
    excerpt: "Post Excerpt",
    content: html,
    imageBanner: { url: null, file: null },
    tagIds: [],
    editStatus: false,
  },
};

export const previewProps: Props = {
  ...props,
  postData: {
    ...props.postData,
    imageBanner: {
      url: null,
      file: new File(["bar"], "bar.jpg", { type: "image/jpeg" }),
    },
    tagIds: [
      "377fba48-d9e3-4b06-aab6-0b29e2c98413",
      "a2ee44f1-323c-41aa-addd-5fca6f3cc309",
      "c11cb682-8a2d-46b8-99d5-8ba33c450ed9",
    ],
    editStatus: true,
  },
};

export const errorsProps: Props = {
  ...props,
  editStatus: "inputError",
  errors: {
    titleError: "Post title error",
    descriptionError: "Post description error",
    excerptError: "Post excerpt error",
    contentError: "Post content error",
    tagIdsError: "Post tags error",
    imageBannerError: "Post image banner error",
    editStatusError: "Post status error",
    idError: "Post id error",
  },
};

export const apiProps: Props = { ...props, isOpen: true };

const unpublishedProps: Props = {
  ...props,
  isOpen: true,
  postStatus: "Unpublished",
  postData: { ...props.postData, editStatus: true },
};

const publishedProps: Props = {
  ...props,
  isOpen: true,
  postStatus: "Published",
  postData: { ...props.postData, editStatus: true },
};

const draftProps: Props = {
  ...props,
  isOpen: true,
  postStatus: "Draft",
  postData: { ...props.postData, editStatus: true },
};

interface Mock {
  paragraph1: string;
  buttonLabel: { name: RegExp };
}

export const dialogUI: [string, Props, Mock][] = [
  [
    "Expect a Draft post to be edited and Published",
    draftProps,
    {
      paragraph1: `You are about to edit and publish this draft post.`,
      buttonLabel: { name: /^publish$/i },
    },
  ],
  [
    "Expect an Unpublished post to be edited and Published",
    unpublishedProps,
    {
      paragraph1: `You are about to edit and publish this unpublished post.`,
      buttonLabel: { name: /^Publish$/i },
    },
  ],
  [
    "Expect a Published post to be edited and Unpublished",
    publishedProps,
    {
      paragraph1: `You are about to edit and unpublish this published post. Un-publishing a blog post will de-list it and make it unavailable to your readers.`,
      buttonLabel: { name: /^unpublish$/i },
    },
  ],
];
