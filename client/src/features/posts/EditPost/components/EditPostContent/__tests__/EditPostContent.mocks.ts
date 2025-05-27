import type { PostActionStatus } from "types/posts";
import type { EditPostFieldErrors } from "types/posts/editPost";

export const next = { name: /^Preview post$/i };
export const content = { name: /^editor editing area/i };
export const errors = { name: /^input validation errors$/i };
export const errorsBtn = { name: /^hide input validation errors alert$/i };
export const idError = "Invalid post id";
export const titleError = "Post title error";
export const descriptionError = "Invalid description length";
export const excerptError = "Post excerpt error";
export const contentError = "Invalid html content string";
export const imageBannerError = "Invalid image string";
export const tagIdsError = "Invalid post tag id provided";
export const editStatusError = "Invalid edit status";
export const html = "<h2>Heading 2</h2><p>paragraph</p>";

export interface Props {
  content: string;
  editErrors: EditPostFieldErrors;
  editStatus: PostActionStatus;
}

export const props: Props = {
  content: "",
  editErrors: {},
  editStatus: "idle",
};

export const apiErrorsProps: Props = {
  content: html,
  editErrors: {
    idError,
    titleError,
    descriptionError,
    excerptError,
    contentError,
    tagIdsError,
    imageBannerError,
    editStatusError,
  },
  editStatus: "inputError",
};
