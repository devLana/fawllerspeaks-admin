import * as React from "react";

interface PostTagsPage {
  handleOpenAlert: (message: string) => void;
}

type PostTagsPageValue = PostTagsPage | null;

export const PostTagsPageContext = React.createContext<PostTagsPageValue>(null);

export const usePostTagsPage = () => {
  const value = React.useContext(PostTagsPageContext);

  if (!value) {
    throw new ReferenceError("PostTags page context provider not available");
  }

  return value;
};
