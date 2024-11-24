import * as React from "react";
import type CustomEditor from "ckeditor5-custom-build";
import { useMutation } from "@apollo/client";
import { DELETE_POST_CONTENT_IMAGES } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";
import { saveStoragePost } from "@utils/posts/storagePost";

const useHandleCKEditor = () => {
  const savedImageUrls = React.useRef(new Set<string>());
  const timerId = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      window.clearTimeout(timerId.current);
    };
  }, []);

  const [deleteImages] = useMutation(DELETE_POST_CONTENT_IMAGES);

  return (editorRef: CustomEditor) => {
    const SUPABASE_HOST = "https://soeoohvasnrkaxvjduim.supabase.co";
    const root = editorRef.model.document.getRoot();
    const content = editorRef.getData().replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "");

    if (content) {
      if (timerId.current) window.clearTimeout(timerId.current);

      timerId.current = window.setTimeout(() => {
        saveStoragePost({ content });
      }, 1000);
    }

    if (root) {
      const range = editorRef.model.createRangeIn(root);
      const items = Array.from(range.getItems());
      const currentImageUrls = new Set<string>();

      items.forEach(item => {
        if (
          item.is("element", "imageBlock") ||
          item.is("element", "imageInline")
        ) {
          const src = item.getAttribute("src");

          if (src && typeof src === "string" && src.startsWith(SUPABASE_HOST)) {
            currentImageUrls.add(src);
          }
        }
      });

      const removedImages = Array.from(savedImageUrls.current).filter(url => {
        return !currentImageUrls.has(url);
      });

      if (removedImages.length > 0) {
        void deleteImages({ variables: { images: removedImages } });
      }

      savedImageUrls.current = currentImageUrls;
    }
  };
};

export default useHandleCKEditor;
