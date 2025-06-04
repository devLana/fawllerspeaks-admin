import type { CreatePostContentEditorProps } from "types/posts/createPost";

const CreatePostContentEditor = ({
  id,
  content,
  contentHasError,
  onBlur,
  onFocus,
  dispatch,
}: CreatePostContentEditorProps) => {
  return (
    <textarea
      aria-label="Editor editing area"
      aria-invalid={contentHasError}
      aria-describedby={contentHasError ? id : undefined}
      aria-errormessage={contentHasError ? id : undefined}
      defaultValue={content}
      onFocus={onFocus}
      onBlur={e => {
        const { value } = e.target;
        dispatch({ type: "ADD_POST_CONTENT", payload: { content: value } });
        onBlur(!value.replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "").trim());
      }}
    />
  );
};

export default CreatePostContentEditor;
