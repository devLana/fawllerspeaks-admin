import type { CreatePostFieldErrors } from "types/posts/createPost";
import type { PostActionStatus } from "types/posts";

export interface Props {
  content: string;
  errors: CreatePostFieldErrors;
  draftStatus: PostActionStatus;
  shouldShow: boolean;
}

export const next = { name: /^preview post$/i };
export const draftBtn = { name: /^save as draft$/i };
export const errors = { name: /^input validation errors$/i };
export const errorsBtn = { name: /^hide input validation errors alert$/i };
export const content = { name: /^editor editing area/i };
export const html = "<h2>Heading 2</h2><p>paragraph</p>";
export const titleError = "Post title error";
export const descriptionError = "Invalid description length";
export const excerptError = "Post excerpt error";
export const imageBannerError = "Invalid image string";
export const tagIdsError = "Invalid post tag id provided";
export const contentError = "Invalid html content string";

export const props: Props = {
  content: "",
  errors: {},
  draftStatus: "idle",
  shouldShow: false,
};

export const apiErrorsProps: Props = {
  content: html,
  errors: {
    titleError,
    descriptionError,
    excerptError,
    contentError,
    tagIdsError,
    imageBannerError,
  },
  draftStatus: "inputError",
  shouldShow: true,
};
