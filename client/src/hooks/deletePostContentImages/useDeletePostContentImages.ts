import { useMutation } from "@apollo/client";

import { DELETE_POST_CONTENT_IMAGES } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";

const useDeletePostContentImages = () => {
  return useMutation(DELETE_POST_CONTENT_IMAGES);
};

export default useDeletePostContentImages;
