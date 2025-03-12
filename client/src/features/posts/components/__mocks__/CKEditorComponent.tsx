import type { CKEditorComponentProps } from "types/posts";

const CKEditorComponent = (props: CKEditorComponentProps) => {
  const { id, data, contentHasError, dispatchFn, onBlur, onFocus } = props;

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
        onBlur(!content.trim());
      }}
    />
  );
};

export default CKEditorComponent;
