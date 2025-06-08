/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import { useApolloClient } from "@apollo/client";
import { DELETE_POST_CONTENT_IMAGES as MUTATION } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";

const useDeletePostContentImages = () => {
  const client = useApolloClient();

  return React.useCallback((images: string[]) => {
    void client.mutate({ mutation: MUTATION, variables: { images } });
  }, []);
};

export default useDeletePostContentImages;
