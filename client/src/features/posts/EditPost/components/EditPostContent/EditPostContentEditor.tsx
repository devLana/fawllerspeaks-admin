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

    if (!root) return;

    const range = editorRef.model.createRangeIn(root);
    const items = Array.from(range.getItems());
    const currentImageUrls = new Set<string>();

    // Gather all current image URLs in the editor
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

    // Find all images deleted from the editor
    const removedImages: string[] = [];
    savedImageUrls.current.forEach(url => {
      if (!currentImageUrls.has(url)) {
        imageUrls.current.delete(url);
        removedImages.push(url);
      }
    });

    if (removedImages.length > 0) deleteImages(removedImages);

    // Update savedImageUrls for next change
    savedImageUrls.current = currentImageUrls;

    // Merge URL of images removed from editor with storage post image URLs
    if (post?.imgUrls && post.imgUrls.length > 0) {
      const storagePostImages = new Set(post.imgUrls);
      imageUrls.current.forEach(url => storagePostImages.add(url));
      imgUrls = Array.from(storagePostImages);
    } else {
      imgUrls = Array.from(imageUrls.current);
    }

    // Debounce save to storage
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
