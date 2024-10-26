import type { CreateInputErrors, CreateStatus } from "types/posts/createPost";

export interface Props {
  content: string;
  draftErrors: CreateInputErrors;
  draftStatus: CreateStatus;
}

export const next = { name: /^preview post$/i };
export const draftBtn = { name: /^save as draft$/i };
export const errorsBtn = { name: /^close draft post errors list$/i };
export const content = { name: /^editor editing area/i };
export const draftErrorsList = { name: /^draft post errors$/i };
export const html = "<h2>Heading 2</h2><p>paragraph</p>";
export const titleError = "Post title error";
export const descriptionError = "Invalid description length";
export const excerptError = "Post excerpt error";
export const imageBannerError = "Invalid image string";
export const tagIdsError = "Invalid post tag id provided";
export const contentError = "Invalid html content string";

export const props: Props = {
  content: "",
  draftErrors: {},
  draftStatus: "idle",
};

export const apiErrorsProps: Props = {
  content: html,
  draftErrors: {
    titleError,
    descriptionError,
    excerptError,
    contentError,
    tagIdsError,
    imageBannerError,
  },
  draftStatus: "inputError",
};
