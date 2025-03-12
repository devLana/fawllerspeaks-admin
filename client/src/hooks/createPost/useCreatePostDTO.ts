import type * as types from "types/posts/createPost";

const useCreatePostDTO = (
  draft: types.DraftHookReturnData,
  create: types.CreateHookReturnData
) => {
  let handleHideErrors: VoidFunction | undefined = undefined;

  let shouldShowErrors = false;
  let errors: types.CreatePostFieldErrors = {};

  if (draft.status === "inputError") {
    shouldShowErrors = true;
    ({ errors, handleHideErrors } = draft);
  } else if (create.status === "inputError") {
    shouldShowErrors = true;
    ({ errors, handleHideErrors } = create);
  }

  let shouldShowSnackbar = false;
  let msg = "";

  if (draft.status === "error") {
    shouldShowSnackbar = true;
    ({ msg, handleHideErrors } = draft);
  } else if (create.status === "error") {
    shouldShowSnackbar = true;
    ({ msg, handleHideErrors } = create);
  }

  return {
    errors,
    shouldShowErrors,
    handleHideErrors,
    msg,
    shouldShowSnackbar,
  };
};

export default useCreatePostDTO;
