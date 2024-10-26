import type { EditPostTagProps } from "types/postTags/editPostTag";

const EditPostTag = ({ open, name, id, dispatch }: EditPostTagProps) => {
  if (!open) return null;

  return (
    <div>
      <p>
        Edit Post Tag - {name}:{id}
      </p>
      <button onClick={() => dispatch({ type: "CLOSE_EDIT" })}>Cancel</button>
    </div>
  );
};

export default EditPostTag;
