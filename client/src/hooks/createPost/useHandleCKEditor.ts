import * as React from "react";

import useDeletePostContentImages from "@hooks/deletePostContentImages/useDeletePostContentImages";
import { saveStoragePost } from "@utils/posts/storagePost";
import { SUPABASE_HOST } from "@utils/posts/constants";
import type CustomEditor from "ckeditor5-custom-build";

const useHandleCKEditor = () => {
  const savedImageUrls = React.useRef(new Set<string>());
  const timerId = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      window.clearTimeout(timerId.current);
    };
  }, []);

  const [deleteImages] = useDeletePostContentImages();

  return (editorRef: CustomEditor) => {
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
