/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import { useApolloClient } from "@apollo/client/react";
import { DELETE_POST_CONTENT_IMAGES as MUTATION } from "@mutations/posts/DELETE_POST_CONTENT_IMAGES";

const useDeletePostContentImages = () => {
  const client = useApolloClient();

  return React.useCallback((input: string | string[]) => {
    let imagesToDelete: string[] = [];

    if (typeof input === "string") {
      // Parse HTML content to extract image sources
      const domParser = new DOMParser();
      const doc = domParser.parseFromString(input, "text/html");
      const imgs = doc.querySelectorAll("img");
      imagesToDelete = Array.from(imgs).reduce((sources: string[], img) => {
        if (img.src) sources.push(img.src);
        return sources;
      }, []);
    } else {
      // Input is already an array of image URLs
      imagesToDelete = input;
    }

    if (imagesToDelete.length > 0) {
      void client.mutate({
        mutation: MUTATION,
        variables: { images: imagesToDelete },
      });
    }
  }, []);
};

export default useDeletePostContentImages;
