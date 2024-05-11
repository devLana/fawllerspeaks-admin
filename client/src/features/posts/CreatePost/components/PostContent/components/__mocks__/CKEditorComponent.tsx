import type { CreatePostAction } from "@types";

interface CKEditorComponentProps {
  data: string;
  dispatch: React.Dispatch<CreatePostAction>;
}

const CKEditorComponent = ({ data, dispatch }: CKEditorComponentProps) => (
  <div>
    <label htmlFor="post-content">Post Content</label>
    <textarea
      id="post-content"
      defaultValue={data}
      onBlur={e =>
        dispatch({
          type: "ADD_POST_CONTENT",
          payload: { content: e.target.value },
        })
      }
    />
  </div>
);

export default CKEditorComponent;
