import * as React from "react";

interface Edit {
  open: boolean;
  name: string;
  id: string;
}

interface DeleteTag {
  open: boolean;
  name: string;
  ids: string[];
}

export interface PostTagsList {
  edit: Edit;
  deleteTags: boolean;
  selectedTags: Record<string, string>;
  deleteTag: DeleteTag;
}

type PostTagsListState = PostTagsList | null;

export const PostTagsListContext = React.createContext<PostTagsListState>(null);

export const usePostTagsList = () => {
  const value = React.useContext(PostTagsListContext);

  if (!value) {
    throw new ReferenceError("PostTagsListContext provider not available");
  }

  return value;
};
