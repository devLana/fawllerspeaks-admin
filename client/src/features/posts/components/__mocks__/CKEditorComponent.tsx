import type { CKEditorComponentProps } from "types/posts";

const CKEditorComponent = ({
  id,
  data,
  contentHasError,
  dispatchFn,
  onBlur,
  onFocus,
  savedImageUrlsRef: _,
  handleChange: __,
}: CKEditorComponentProps) => {
  return (
    <textarea
      aria-label="Editor editing area"
      aria-invalid={contentHasError}
      aria-describedby={contentHasError ? id : undefined}
      aria-errormessage={contentHasError ? id : undefined}
      defaultValue={data}
      onFocus={onFocus}
      onBlur={e => {
        const { value: content } = e.target;
        dispatchFn(content);
        onBlur(!content.replace(/<p>(?:<br>)*&nbsp;<\/p>/g, ""));
      }}
    />
  );
};

export default CKEditorComponent;
