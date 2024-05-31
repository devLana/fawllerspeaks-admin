import type { CreatePostAction } from "@types";

interface CKEditorComponentProps {
  data: string;
  contentIsEmpty: boolean;
  dispatch: React.Dispatch<CreatePostAction>;
  onFocus: VoidFunction;
  onBlur: (value: boolean) => void;
}

const CKEditorComponent = (props: CKEditorComponentProps) => {
  const { data, dispatch, onBlur, onFocus } = props;

  return (
    <div>
      <label htmlFor="post-content">Post Content</label>
      <textarea
        id="post-content"
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
