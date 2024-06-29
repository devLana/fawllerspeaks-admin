import type { CKEditorComponentProps } from "@types";

const CKEditorComponent = (props: CKEditorComponentProps) => {
  const { id, data, contentHasError, dispatch, onBlur, onFocus } = props;

  return (
    <div>
      <textarea
        aria-label="Editor editing area"
        aria-invalid={contentHasError}
        aria-describedby={contentHasError ? id : undefined}
        aria-errormessage={contentHasError ? id : undefined}
        defaultValue={data}
        onFocus={onFocus}
        onBlur={e => {
          const { value: content } = e.target;
          dispatch({ type: "ADD_POST_CONTENT", payload: { content } });
          onBlur(!content);
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
