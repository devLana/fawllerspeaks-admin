import * as React from "react";

interface PostTagsPageContextValue {
  handleOpenAlert: (message: string) => void;
}

type PostTagsPageContextValues = PostTagsPageContextValue | null;

export const PostTagsPageContext =
  React.createContext<PostTagsPageContextValues>(null);

export const usePostTagsPage = () => {
  const value = React.useContext(PostTagsPageContext);

  if (!value) {
    throw new ReferenceError("PostTagsPageContext provider not available");
  }

  return value;
};
