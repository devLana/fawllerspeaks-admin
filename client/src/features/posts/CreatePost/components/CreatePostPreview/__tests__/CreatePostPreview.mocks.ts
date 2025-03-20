import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { testPostTag } from "@utils/tests/testPostTag";
import type { GetPostTagsData } from "types/postTags/getPostTags";
import type { CreatePostFieldErrors } from "types/posts/createPost";
import type { PostInputData } from "types/posts";

export const html = "<h2>Heading 2</h2><p>paragraph</p>";
export const postInfo = { name: /^post information$/i };
export const postTags = { name: /^post tags$/i };
export const postImg = { name: /^post title image banner$/i };
export const postContent = { name: /^post content$/i };
export const errors = { name: /^input validation errors$/i };
export const hideErrors = { name: /^hide input validation errors alert$/i };
export const draftBtn = { name: /^save as draft$/i };
export const previewMenu = { name: /^post preview actions menu$/i };
export const publish = { name: /^publish post$/i };
export const menuDraft = { name: /^save post as draft$/i };
export const dialog = { name: /^publish blog post$/i };
export const create = { name: /^publish post$/i };
export const pub = { name: /^publish$/i };

export interface Props {
  isOpen: boolean;
  postData: PostInputData;
  shouldShow: boolean;
  errors: CreatePostFieldErrors;
}

export const props: Props = {
  isOpen: false,
  postData: {
    title: "Post Title",
    description: "Post Description",
    excerpt: "Post Excerpt",
    content: html,
    imageBanner: null,
    tagIds: [],
  },
  errors: {},
  shouldShow: false,
};

export const previewProps: Props = {
  ...props,
  postData: {
    ...props.postData,
    imageBanner: new File(["bar"], "bar.jpg", { type: "image/jpeg" }),
    tagIds: ["id-1", "id-2", "id-4", "id-5"],
  },
};

export const errorsProps: Props = {
  ...props,
  errors: {
    titleError: "Post title error",
    descriptionError: "Post description error",
    excerptError: "Post excerpt error",
    contentError: "Post content error",
    tagIdsError: "Post tags error",
    imageBannerError: "Post image banner error",
  },
  shouldShow: true,
};

export const apiProps: Props = { ...props, isOpen: true };

const tagNames = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"];
const tags = tagNames.map((tag, idx) => testPostTag(tag, `id-${idx + 1}`));
export const writeTags: Cache.WriteQueryOptions<GetPostTagsData, object> = {
  query: GET_POST_TAGS,
  data: { getPostTags: { __typename: "PostTags", tags } },
};
