import type { DeletePostTagsProps } from "types/postTags/deletePostTags";

const DeletePostTags = ({ open, name, ids, dispatch }: DeletePostTagsProps) => {
  if (!open) return null;

  const word = ids.length > 1 ? "Tags" : "Tag";

  return (
    <div>
      <p>
        Delete Post {word} - {name}|{ids.join(",")}
      </p>
      <button onClick={() => dispatch({ type: "CLOSE_DELETE" })}>Cancel</button>
    </div>
  );
};

export default DeletePostTags;
