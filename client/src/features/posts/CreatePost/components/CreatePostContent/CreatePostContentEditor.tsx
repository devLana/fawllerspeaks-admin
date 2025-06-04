import * as React from "react";

import { useMutation } from "@apollo/client";

import CKEditorComponent from "@features/posts/components/CKEditorComponent";
import { saveCreateStoragePost as cb } from "@utils/posts/createStoragePost";
import { DELETE_POST_CONTENT_IMAGES } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";
import type CustomEditor from "ckeditor5-custom-build";
import type { CreatePostContentEditorProps } from "types/posts/createPost";

const CreatePostContentEditor = (props: CreatePostContentEditorProps) => {
  const savedImageUrls = React.useRef(new Set<string>());
  const timerId = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      window.clearTimeout(timerId.current);
    };
  }, []);

  const [deleteImages] = useMutation(DELETE_POST_CONTENT_IMAGES);

  const handleChange = (editorRef: CustomEditor) => {
    const root = editorRef.model.document.getRoot();
    const regex = /<p>(?:<br>)*&nbsp;<\/p>/g;
    const content = editorRef.getData().replace(regex, "").trim();

    if (timerId.current) window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(cb, 1500, { content });

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
          if (src && typeof src === "string") currentImageUrls.add(src);
        }
      });

      const removedImages = Array.from(savedImageUrls.current).filter(
        url => !currentImageUrls.has(url)
      );

      if (removedImages.length > 0) {
        void deleteImages({ variables: { images: removedImages } });
      }

      savedImageUrls.current = currentImageUrls;
    }
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

export default CreatePostContentEditor;
