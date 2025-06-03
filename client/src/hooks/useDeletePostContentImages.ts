import { useMutation } from "@apollo/client";

import { DELETE_POST_CONTENT_IMAGES } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";

const useDeletePostContentImages = () => {
  const [deleteImages] = useMutation(DELETE_POST_CONTENT_IMAGES);

  return (content: string) => {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(content, "text/html");
    const imgs = doc.querySelectorAll("img");

    const images = Array.from(imgs).reduce((sources: string[], img) => {
      if (img.src) sources.push(img.src);
      return sources;
    }, []);

    if (images.length > 0) void deleteImages({ variables: { images } });
  };
};

export default useDeletePostContentImages;
