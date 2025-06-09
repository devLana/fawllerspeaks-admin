import * as React from "react";

import useDeletePostContentImages from "@hooks/useDeletePostContentImages";
import CKEditorComponent from "@features/posts/components/CKEditorComponent";
import * as storage from "@utils/posts/editStoragePost";
import type CustomEditor from "ckeditor5-custom-build";
import type { EditPostContentEditorProps } from "types/posts/editPost";

const EditPostContentEditor = (props: EditPostContentEditorProps) => {
  const savedImageUrls = React.useRef(new Set<string>());
  const imageUrls = React.useRef(new Set<string>());
  const timerId = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      window.clearTimeout(timerId.current);
    };
  }, []);

  const deleteImages = useDeletePostContentImages();

  const handleChange = (editorRef: CustomEditor) => {
    const root = editorRef.model.document.getRoot();
    const content = editorRef.getData().replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "");
    const post = storage.getEditStoragePost();
    let imgUrls: string[] = [];

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
            if (!savedImageUrls.current.has(src)) imageUrls.current.add(src);
            currentImageUrls.add(src);
          }
        }
      });

      const removedImages = Array.from(savedImageUrls.current).filter(url => {
        if (!currentImageUrls.has(url)) {
          imageUrls.current.delete(url);
          return true;
        }

        return false;
      });

      if (removedImages.length > 0) deleteImages(removedImages);

      savedImageUrls.current = currentImageUrls;
    }

    if (post?.imgUrls && post.imgUrls.length > 0) {
      const merged = new Set(post.imgUrls);
      imageUrls.current.forEach(url => merged.add(url));
      imgUrls = Array.from(merged);
    } else {
      imgUrls = Array.from(imageUrls.current);
    }

    if (timerId.current) window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(storage.saveEditStoragePost, 1500, {
      content,
      imgUrls,
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
