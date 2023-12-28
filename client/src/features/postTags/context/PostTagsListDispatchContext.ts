import * as React from "react";
import type { Action } from "../GetPostTags/components/PostTags/utils/postTagsList.reducer";

type PostTagsListDispatcher = React.Dispatch<Action> | null;

export const PostTagsListDispatchContext =
  React.createContext<PostTagsListDispatcher>(null);

export const usePostTagsListDispatch = () => {
  const value = React.useContext(PostTagsListDispatchContext);

  if (!value) {
    const msg = "PostTagsListDispatchContext provider not available";
    throw new ReferenceError(msg);
  }

  return value;
};
