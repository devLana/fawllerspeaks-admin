import * as React from "react";

interface PostTagsContextValue {
  handleOpenAlert: (message: string) => void;
}

type PostTagsContextValues = PostTagsContextValue | null;

export const PostTagsContext = React.createContext<PostTagsContextValues>(null);

export const usePostTags = () => {
  const value = React.useContext(PostTagsContext);

  if (!value) {
    throw new ReferenceError("PostTagsContext provider not available");
  }

  return value;
};
