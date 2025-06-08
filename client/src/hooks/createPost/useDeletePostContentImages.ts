import { useApolloClient } from "@apollo/client";

import { DELETE_POST_CONTENT_IMAGES as MUTATION } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";

const useDeletePostContentImages = () => {
  const client = useApolloClient();

  return (content: string) => {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(content, "text/html");
    const imgs = doc.querySelectorAll("img");

    const images = Array.from(imgs).reduce((sources: string[], img) => {
      if (img.src) sources.push(img.src);
      return sources;
    }, []);

    if (images.length > 0) {
      void client.mutate({ mutation: MUTATION, variables: { images } });
    }
  };
};

export default useDeletePostContentImages;
