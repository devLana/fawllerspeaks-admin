import * as React from "react";

import { useMutation } from "@apollo/client";

import CKEditorComponent from "@features/posts/components/CKEditorComponent";
import { saveEditStoragePost as cb } from "@utils/posts/editStoragePost";
import { DELETE_POST_CONTENT_IMAGES } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";
import type CustomEditor from "ckeditor5-custom-build";
import type { EditPostContentEditorProps } from "types/posts/editPost";

const EditPostContentEditor = (props: EditPostContentEditorProps) => {
  const savedImageUrls = React.useRef(new Set<string>());
  const imgUrls = React.useRef(new Set<string>());
  const timerId = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      window.clearTimeout(timerId.current);
    };
  }, []);

  const [deleteImages] = useMutation(DELETE_POST_CONTENT_IMAGES);

  const handleChange = (editorRef: CustomEditor) => {
    const root = editorRef.model.document.getRoot();
    const content = editorRef.getData().replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "");

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
          if (src && typeof src === "string") {
            if (!savedImageUrls.current.has(src)) imgUrls.current.add(src);
            currentImageUrls.add(src);
          }
        }
      });

      const removedImages = Array.from(savedImageUrls.current).filter(url => {
        if (!currentImageUrls.has(url)) {
          imgUrls.current.delete(url);
          return true;
        }

        return false;
      });

      if (removedImages.length > 0) {
        void deleteImages({ variables: { images: removedImages } });
      }

      savedImageUrls.current = currentImageUrls;
    }

    if (timerId.current) window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(cb, 1500, {
      content,
      imgUrls: Array.from(imgUrls.current),
    });
  };

  const dispatchFn = (content: string) => {
    props.dispatch({ type: "ADD_POST_CONTENT", payload: { content } });
  };

  return (
    <CKEditorComponent
      savedImageUrlsRef={savedImageUrls}
      id={props.id}
      data={props.content}
      contentHasError={props.contentHasError}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      dispatchFn={dispatchFn}
      handleChange={handleChange}
    />
  );
};

export default EditPostContentEditor;
